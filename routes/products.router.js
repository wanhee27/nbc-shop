import express from 'express';
import Products from '../schemas/products.schema.js';

const router = express.Router();

//NOTE - 상품 등록 API (POST)
router.post('/products', async (req, res, next) => {
  try {
    const { title, content, author, status } = req.body;
    const addProduct = new Products({
      title,
      content,
      author,
      status,
    });
    const savedProduct = await addProduct.save();
    return res
      .status(201)
      .json({ message: '판매 상품을 등록하였습니다.', data: savedProduct });
  } catch (error) {
    next(error);
  }
});

//NOTE - 상품 목록 조회 (GET)
router.get('/products', async (req, res, next) => {
  try {
    const products = await Products.find().exec();

    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: '상품 조회에 실패하였습니다.' });
  }
});

//NOTE - 상품 상세 조회 (GET)
router.get('/products/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    // 상품 상세 조회
    const product = await Products.findById(productId).exec();

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    // 상품 상세 조회 결과를 클라이언트에 반환
    return res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
});

//NOTE - 상품 수정 (PUT)
router.patch('/products/:productId', async (req, res) => {
  return res.status(200).json({});
});

//NOTE - 상품 삭제 (DELETE)
router.delete('/products/:productId', async (req, res, next) => {
  const { productId } = req.params;

  const products = await Products.findById(productId).exec();
  if (!toproductsdo) {
    return res
      .status(404)
      .json({ errorMessage: '상품 조회에 실패하였습니다.' });
  }

  await Products.deleteOne({ _id: productId });
  return res.status(202).json({});
});

export default router;
