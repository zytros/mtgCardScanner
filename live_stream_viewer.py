from pathlib import Path
import argparse

import cv2


def open_capture(indices):
    available_devices = sorted(str(path) for path in Path("/dev").glob("video*"))
    if available_devices:
        print(f"Detected video devices: {', '.join(available_devices)}")
    else:
        print("No /dev/video* devices detected by the OS")

    for index in indices:
        cap = cv2.VideoCapture(index)
        if cap.isOpened():
            print(f"Opened video capture device at index {index}")
            return cap, index
        cap.release()

    raise IOError("Unable to open any video capture device")


def main():
    parser = argparse.ArgumentParser(description="Display a live video stream from a capture device.")
    parser.add_argument(
        "--indices",
        nargs="+",
        type=int,
        default=list(range(6)),
        help="Capture indices to try, in order.",
    )
    parser.add_argument("--width", type=int, default=1280, help="Requested frame width.")
    parser.add_argument("--height", type=int, default=720, help="Requested frame height.")
    parser.add_argument("--window-name", default="Live Stream", help="Display window title.")
    args = parser.parse_args()

    cap, index = open_capture(args.indices)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, args.width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, args.height)

    print("Press q or Esc to exit.")
    try:
        while True:
            success, frame = cap.read()
            if not success or frame is None:
                raise IOError(f"Failed to read a frame from capture index {index}")

            cv2.imshow(args.window_name, frame)

            key = cv2.waitKey(1) & 0xFF
            if key in (ord("q"), 27):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()