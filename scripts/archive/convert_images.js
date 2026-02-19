const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../public/Website photos');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function convertHeicToJpeg() {
  console.log('Starting conversion process in:', targetDir);
  
  if (!fs.existsSync(targetDir)) {
    console.error('Target directory does not exist!');
    return;
  }

  const allFiles = getAllFiles(targetDir);
  const heicFiles = allFiles.filter(file => file.toLowerCase().endsWith('.heic'));

  console.log(`Found ${heicFiles.length} HEIC files.`);

  heicFiles.forEach((file, index) => {
    const outputFileName = file.replace(/\.heic$/i, '.jpg');
    console.log(`[${index + 1}/${heicFiles.length}] Converting: ${path.basename(file)}`);

    try {
      // FFmpeg command to convert HEIC to JPEG
      // -vf "scale='min(1920,iw)':-1" : Resize to max-width 1920px, maintaining aspect ratio
      // -q:v 4 : Quality factor (roughly equivalent to 80-85%)
      execSync(`ffmpeg -i "${file}" -vf "scale='min(1920,iw)':-1" -q:v 4 -y "${outputFileName}"`, { stdio: 'inherit' });
      console.log(`Successfully converted to ${path.basename(outputFileName)}`);
    } catch (error) {
      console.error(`Failed to convert ${path.basename(file)}:`, error.message);
    }
  });

  console.log('Conversion process finished!');
}

convertHeicToJpeg();
