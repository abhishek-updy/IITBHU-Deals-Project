/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * - Reduces 15MB+ iPhone/Android photos down to ~500KB-800KB without visible quality loss.
 * - Leaves files that are already small (under 1MB) untouched.
 * - Works natively on all modern mobile and desktop browsers (no external libraries needed).
 */
export const compressImage = async (file) => {
  // If the file is not an image or is already smaller than 1MB, return as-is
  if (!file.type.startsWith("image/") || file.size <= 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 1600px is crisp and sharp for all mobile and laptop displays
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Export as high-quality JPEG (quality 0.82)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file); // fallback to original on failure
            }

            // Create a clean new File object with JPEG extension
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], cleanName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          0.82
        );
      };

      img.onerror = () => resolve(file);
      img.src = event.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};
