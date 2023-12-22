const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img");
  imgPreview = document.querySelector('.preview-img img');
  cropButton = document.getElementById('cropImage');
  fileInputt = document.querySelector('.file-input');
  shareButton = document.querySelector('.share');
  collageButton = document.querySelector('.collage');

let brightness = "100",
    saturation = "100",
    inversion = "0",
    grayscale = "0";
    rotate = 0,
    flipHorizontal = 1,
    flipVertical = 1;

  
const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

// -------------------------------------------------------------------------------
// Function to handle image selection

fileInputt.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      imgPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

  // Function to reattach event listeners after cropping the image
  function reattachEventListeners() {
    filterSlider.addEventListener("input", updateFilter);
    resetFilterBtn.addEventListener("click", resetFilter);
    saveImgBtn.addEventListener("click", saveImage);
    fileInput.addEventListener("change", loadImage);
    chooseImgBtn.addEventListener("click", () => fileInput.click());
    // Reattach event listener for text overlay button
    const textButton = document.getElementById('text');
    textButton.addEventListener('click', addTextOverlay);
  }
  
//#######################################################################################################################################################
// Function to handle the crop action

cropButton.addEventListener('click', function() {
  // Ensure image is loaded before cropping
if (!imgPreview.complete) {
  return;
}

// Create a canvas element to work with
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Set canvas dimensions to match the desired cropped area (top-left quadrant)
const croppedWidth = imgPreview.width / 2;
const croppedHeight = imgPreview.height / 2;
canvas.width = croppedWidth;
canvas.height = croppedHeight;

// Draw the desired portion (top-left quadrant) onto the canvas
context.drawImage(
  imgPreview,
  0,
  0,
  croppedWidth,
  croppedHeight,
  0,
  0,
  croppedWidth,
  croppedHeight
);

// Update the existing image element with the cropped image
imgPreview.src = canvas.toDataURL();
imgPreview.width = croppedWidth;
imgPreview.height = croppedHeight;

resetFilter();
// Reattach event listeners after cropping
reattachEventListeners();
});


// -----------------------------*************************** 
// Function to handle text overlay
let textData = {
  text: '', // Text to be displayed on the image
  x: 50, // X-coordinate for text position (adjust as needed)
  y: 50, // Y-coordinate for text position (adjust as needed)
  color: 'black' // Default text color
};
// ... (existing code remains the same)

const addTextOverlay = () => {
  textData.text = prompt('Enter text:'); // Prompt user to enter text

  if (textData.text) {
    textData.color = prompt('Enter text color (hex or name):') || 'black'; // Prompt user to enter text color
    applyTextOverlay(); // Call the function to apply text overlay on the preview image
  }
};

function applyTextOverlay() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgPreview.naturalWidth;
  canvas.height = imgPreview.naturalHeight;

  // Draw the original image onto the canvas
  ctx.drawImage(imgPreview, 0, 0);

  // Apply the text overlay on the canvas
  ctx.font = 'bold 40px Arial'; // Set font size and type (adjust size as needed)
  ctx.fillStyle = textData.color; // Set text color
  ctx.fillText(textData.text, textData.x, textData.y);

  // Update the preview image with the text overlay
  previewImg.src = canvas.toDataURL(); // Update the preview image source with the canvas content
  
  resetFilter();
    reattachEventListeners();
};



// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;
    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});


const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");
  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

// Function to handle image sharing
  function shareImage(title, url, text) {
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);
    const shareText = encodeURIComponent(text);
    const link = `https://wa.me/?text=${shareTitle}%20${shareUrl}%20${shareText}`;
    window.open(link, '_blank');
}

// Function to create a collage from the preview image
const createCollage = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = previewImg.width;
  const height = previewImg.height;

  canvas.width = width * 2;
  canvas.height = height * 2;

   // Save current filter settings
   const currentBrightness = brightness;
   const currentSaturation = saturation;
   const currentInversion = inversion;
   const currentGrayscale = grayscale;
 
  // Draw the preview image in a 2x2 grid on the canvas
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.drawImage(previewImg, 0, 0, width, height);
  ctx.drawImage(previewImg, width, 0, width, height);
  ctx.drawImage(previewImg, 0, height, width, height);
  ctx.drawImage(previewImg, width, height, width, height);


   // Restore previous filter settings
   brightness = currentBrightness;
   saturation = currentSaturation;
   inversion = currentInversion;
   grayscale = currentGrayscale;
   applyFilter();

  // Replace the preview image with the collage image
  previewImg.src = canvas.toDataURL();

  // Reset filters and transformations
  // resetFilter();
  reattachEventListeners();
};


// -----------------------------------------------------------------------------------------

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  filterOptions[0].click();
  applyFilter();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgPreview.naturalWidth;
  canvas.height = imgPreview.naturalHeight;

  // Draw the original image onto the canvas
  ctx.drawImage(imgPreview, 0, 0);

  // Apply filters and transformations
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); // Translate to the center
  ctx.rotate((rotate * Math.PI) / 180); // Rotate
  ctx.scale(flipHorizontal, flipVertical); // Scale
  ctx.drawImage(
    imgPreview,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  // Apply text overlay on the canvas
  ctx.font = 'bold 40px Arial'; // Set font size and type (adjust size as needed)
  ctx.fillStyle = textData.color; // Set text color
  ctx.fillText(textData.text, textData.x, textData.y);

  // Create a download link for the canvas image
  const link = document.createElement("a");
  link.download = "image_with_text_and_filters.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

// -------------------------------------------------------------------------

window.addEventListener('load', function() {
  const listItems = document.querySelectorAll('.features-list .hidden');

  listItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
    }, (index + 1) * 200); // Change the delay here (200ms = 0.2s)
  });
});

// JavaScript for FAQ section toggle
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    item.querySelector('.question').classList.toggle('active');
  });
});

// Function to attach event listeners
function attachEventListeners() {
  filterSlider.addEventListener("input", updateFilter);
  resetFilterBtn.addEventListener("click", resetFilter);
  saveImgBtn.addEventListener("click", saveImage);
  fileInput.addEventListener("change", loadImage);
  chooseImgBtn.addEventListener("click", () => fileInput.click());
  const textButton = document.getElementById('text');
  textButton.addEventListener('click', addTextOverlay);
  shareButton.addEventListener('click', shareImage);
  collageButton.addEventListener('click', createCollage);
}

// Attach initial event listeners
attachEventListeners();


