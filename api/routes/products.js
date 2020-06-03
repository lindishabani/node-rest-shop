const express = require("express");
const router = express.Router();
const multer = require("multer")
const checkAuth = require("../middleware/check-auth")

const ProductsController = require("../controllers/products")

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/")
  }, 
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(new Error("Unrecongized file type"), false)
  }
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  }, 
  fileFilter: fileFilter,
})

router.get("/", ProductsController.getAllProducts)
router.post("/", checkAuth, upload.single("productImage"), ProductsController.createProduct)
router.get("/:productId", ProductsController.getSingleProduct)
router.patch("/:productId", checkAuth, ProductsController.updateProduct)
router.delete("/:productId", checkAuth, ProductsController.deleteProduct)

module.exports = router