/**
 * Extracts the dominant color from an image
 */
export const extractDominantColor = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#333333'); // Fallback color
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      // Sample pixels at regular intervals for better performance
      const stride = Math.max(1, Math.floor(data.length / 4 / 1000)); // Sample up to 1000 pixels
      
      for (let i = 0; i < data.length; i += 4 * stride) {
        // Skip transparent pixels
        if (data[i + 3] < 128) continue;
        
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      
      if (count === 0) {
        resolve('#333333'); // Fallback color
        return;
      }
      
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      resolve(hexColor);
    };
    
    img.onerror = () => {
      resolve('#333333'); // Fallback color
    };
  });
};

/**
 * Generates complementary colors based on the dominant color
 */
export const generateColorPalette = (baseColor: string) => {
  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Generate text color based on brightness
  const textColor = brightness > 128 ? '#121212' : '#ffffff';
  
  // Generate slightly darker version for accents
  const darkerR = Math.max(0, r - 30);
  const darkerG = Math.max(0, g - 30);
  const darkerB = Math.max(0, b - 30);
  const darkerColor = `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
  
  return {
    base: baseColor,
    text: textColor,
    accent: darkerColor,
    isLight: brightness > 128
  };
};