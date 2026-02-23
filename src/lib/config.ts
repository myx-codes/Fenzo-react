export const serverApi: string = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
    // --- General System Errors ---
    error1: "Something went wrong! Please try again later.",
    serverConnection: "Could not connect to the server. Please check your internet connection.",
    
    // --- Authentication & User ---
    errorLogin: "Incorrect username or password.",
    errorUserExists: "User with this email or phone number already exists.",
    usedNickPhone: "This nickname or phone number is already in use.",
    errorUnauthorized: "You are not authorized. Please log in first.",
    errorSessionExpired: "Your session has expired. Please log in again.",
    
    // --- Validation ---
    errorValidation: "Please fill in all required fields.",
    errorInvalidPhone: "Please enter a valid phone number.",
    errorPasswordMatch: "Passwords do not match.",

    // --- Products & Inventory ---
    errorProductNotFound: "Product not found.",
    errorOutOfStock: "Sorry, this item is currently out of stock.",
    errorLowStock: "You cannot add more items than available in stock.",

    // --- Cart & Wishlist ---
    errorCartAdd: "Failed to add item to cart.",
    errorWishlist: "Failed to update wishlist.",

    // --- Media / Uploads ---
    errorImageSize: "Image file is too large. Max size is 5MB.",
    errorImageFormat: "Invalid file format. Only JPG, PNG, and WEBP are allowed.",
};