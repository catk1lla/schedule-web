#!/usr/bin/env python3
"""Generate rounded, high-quality icon variants from icon.png."""
from __future__ import annotations

import math
import struct
import zlib
from pathlib import Path

PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
BPP = 4


def read_png_rgba(path: Path):
    blob = path.read_bytes()
    if not blob.startswith(PNG_SIGNATURE):
        raise ValueError("Unsupported PNG signature")
    pos = 8
    ihdr = None
    idat_chunks = []
    while pos < len(blob):
        if pos + 8 > len(blob):
            break
        length = struct.unpack(">I", blob[pos : pos + 4])[0]
        pos += 4
        ctype = blob[pos : pos + 4]
        pos += 4
        data = blob[pos : pos + length]
        pos += length + 4  # skip CRC
        if ctype == b"IHDR":
            ihdr = data
        elif ctype == b"IDAT":
            idat_chunks.append(data)
    if ihdr is None:
        raise ValueError("IHDR chunk missing")
    width, height, bit_depth, color_type, comp, filt, interlace = struct.unpack(
        ">IIBBBBB", ihdr
    )
    if bit_depth != 8 or color_type != 6 or comp != 0 or filt != 0 or interlace != 0:
        raise ValueError("Only 8-bit RGBA, non-interlaced PNG is supported")
    compressed = b"".join(idat_chunks)
    raw = zlib.decompress(compressed)
    stride = width * BPP
    rows = []
    idx = 0
    prev = bytearray(stride)
    for _ in range(height):
        filter_type = raw[idx]
        idx += 1
        scan = bytearray(raw[idx : idx + stride])
        idx += stride
        recon = unfilter_scanline(filter_type, scan, prev)
        rows.append(bytes(recon))
        prev = recon
    return width, height, rows


def unfilter_scanline(filter_type, scanline, prev):
    result = bytearray(len(scanline))
    if filter_type == 0:
        result[:] = scanline
    elif filter_type == 1:
        for i, val in enumerate(scanline):
            left = result[i - BPP] if i >= BPP else 0
            result[i] = (val + left) & 0xFF
    elif filter_type == 2:
        for i, val in enumerate(scanline):
            up = prev[i]
            result[i] = (val + up) & 0xFF
    elif filter_type == 3:
        for i, val in enumerate(scanline):
            left = result[i - BPP] if i >= BPP else 0
            up = prev[i]
            result[i] = (val + ((left + up) // 2)) & 0xFF
    elif filter_type == 4:
        for i, val in enumerate(scanline):
            a = result[i - BPP] if i >= BPP else 0
            b = prev[i]
            c = prev[i - BPP] if i >= BPP else 0
            result[i] = (val + paeth_predictor(a, b, c)) & 0xFF
    else:
        raise ValueError(f"Unsupported filter type: {filter_type}")
    return result


def paeth_predictor(a, b, c):
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def resize_rows(rows, src_w, src_h, target_size):
    if target_size == src_w == src_h:
        return rows
    scale_x = src_w / target_size
    scale_y = src_h / target_size
    output = []
    for y in range(target_size):
        sy = (y + 0.5) * scale_y - 0.5
        y0 = max(0, min(src_h - 1, math.floor(sy)))
        y1 = min(src_h - 1, y0 + 1)
        wy = sy - y0
        row_top = rows[y0]
        row_bottom = rows[y1]
        new_row = bytearray(target_size * BPP)
        for x in range(target_size):
            sx = (x + 0.5) * scale_x - 0.5
            x0 = max(0, min(src_w - 1, math.floor(sx)))
            x1 = min(src_w - 1, x0 + 1)
            wx = sx - x0
            for channel in range(BPP):
                idx00 = x0 * BPP + channel
                idx01 = x1 * BPP + channel
                v00 = row_top[idx00]
                v01 = row_top[idx01]
                v10 = row_bottom[idx00]
                v11 = row_bottom[idx01]
                top = v00 * (1 - wx) + v01 * wx
                bottom = v10 * (1 - wx) + v11 * wx
                value = int(round(top * (1 - wy) + bottom * wy))
                new_row[x * BPP + channel] = value
        output.append(bytes(new_row))
    return output


def apply_rounded_mask(rows, size, radius_ratio=0.2):
    radius = max(1, int(round(size * radius_ratio)))
    if radius <= 0:
        return rows
    radius_sq = radius * radius
    cx = radius - 0.5
    cy = cx
    corners = (
        ("tl", lambda x, y: (cx, cy, x < radius and y < radius)),
        ("tr", lambda x, y: (size - radius - 0.5, cy, x >= size - radius and y < radius)),
        ("bl", lambda x, y: (cx, size - radius - 0.5, x < radius and y >= size - radius)),
        (
            "br",
            lambda x, y: (
                size - radius - 0.5,
                size - radius - 0.5,
                x >= size - radius and y >= size - radius,
            ),
        ),
    )
    new_rows = []
    for y in range(size):
        row = bytearray(rows[y])
        for x in range(size):
            alpha_index = x * BPP + 3
            adjust = False
            for _, corner_fn in corners:
                cx_val, cy_val, in_corner = corner_fn(x, y)
                if not in_corner:
                    continue
                dx = (x + 0.5) - cx_val
                dy = (y + 0.5) - cy_val
                dist_sq = dx * dx + dy * dy
                if dist_sq > radius_sq:
                    row[alpha_index] = 0
                    adjust = True
                elif dist_sq > (radius - 1) * (radius - 1):
                    dist = math.sqrt(dist_sq)
                    factor = max(0.0, min(1.0, radius - dist))
                    row[alpha_index] = int(row[alpha_index] * factor)
                    adjust = True
                if adjust:
                    break
        new_rows.append(bytes(row))
    return new_rows


def make_chunk(ctype, data):
    return (
        struct.pack(">I", len(data))
        + ctype
        + data
        + struct.pack(">I", zlib.crc32(ctype + data) & 0xFFFFFFFF)
    )


def encode_png(rows, width, height):
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    raw = bytearray()
    for row in rows:
        raw.append(0)
        raw.extend(row)
    compressed = zlib.compress(bytes(raw))
    return PNG_SIGNATURE + make_chunk(b"IHDR", ihdr) + make_chunk(b"IDAT", compressed) + make_chunk(
        b"IEND", b""
    )


def write_file(path: Path, data: bytes):
    path.write_bytes(data)


def build_favicon(png_map, sizes):
    header = struct.pack("<HHH", 0, 1, len(sizes))
    entries = []
    offset = 6 + 16 * len(sizes)
    blobs = []
    for size in sizes:
        data = png_map[size]
        width_byte = size if size < 256 else 0
        entry = struct.pack(
            "<BBBBHHII",
            width_byte,
            width_byte,
            0,
            0,
            1,
            32,
            len(data),
            offset,
        )
        entries.append(entry)
        blobs.append(data)
        offset += len(data)
    return header + b"".join(entries) + b"".join(blobs)


def main():
    root = Path(__file__).resolve().parents[1]
    source = root / "icon.png"
    out_dir = root / "icons"
    sizes = [
        16,
        32,
        48,
        57,
        60,
        64,
        72,
        76,
        96,
        114,
        120,
        128,
        144,
        152,
        167,
        180,
        192,
        196,
        256,
        384,
        512,
        1024,
    ]
    favicon_sizes = [16, 32, 48]
    app_size = 1024
    out_dir.mkdir(exist_ok=True)
    src_w, src_h, src_rows = read_png_rgba(source)
    png_cache = {}
    for size in sizes:
        resized = resize_rows(src_rows, src_w, src_h, size)
        rounded = apply_rounded_mask(resized, size)
        data = encode_png(rounded, size, size)
        png_cache[size] = data
        write_file(out_dir / f"icon-{size}.png", data)
    for size in favicon_sizes:
        write_file(out_dir / f"favicon-{size}x{size}.png", png_cache[size])
    write_file(out_dir / "apple-touch-icon.png", png_cache[180])
    write_file(out_dir / "app-icon.png", png_cache[app_size])
    ico_data = build_favicon(png_cache, favicon_sizes)
    write_file(out_dir / "favicon.ico", ico_data)
    print(f"Generated {len(sizes)} icon sizes plus favicon assets in {out_dir}")


if __name__ == "__main__":
    main()
