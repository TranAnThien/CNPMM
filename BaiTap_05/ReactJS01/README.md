# KeyViet Store frontend

Frontend Vite + React cho website bán bàn phím cơ, dùng Tailwind CSS (CDN) và Swiper cho trang chi tiết sản phẩm.

## Setup

```bash
npm install
npm run dev
```

## Environment

Create a `.env` file in `ReactJS01/` and set:

```bash
VITE_BACKEND_URL=http://localhost:8888
```

## Main routes

- `/` - trang chủ public
- `/shop` - trang danh sách sản phẩm public
- `/product/:id` - trang chi tiết sản phẩm public
- `/login` - đăng nhập
- `/register` - đăng ký
- `/forgot-password` - quên mật khẩu
- `/tai-khoan` - trang tài khoản (cần đăng nhập)

## Notes

- Toàn bộ UI đã chuyển sang Tailwind CSS.
- API sản phẩm là public để Guest có thể xem hàng.
- Bảo vệ route chỉ áp dụng cho trang tài khoản thành viên.
