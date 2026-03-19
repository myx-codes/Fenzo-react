export type SupportedLanguage = "en" | "uz" | "ko";

export const LANGUAGE_STORAGE_KEY = "appLanguage";

export const languageOptions: Array<{ value: SupportedLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "uz", label: "O'zbek" },
  { value: "ko", label: "한국어" },
];

type TranslationMap = {
  language: string;
  search: string;
  home: string;
  products: string;
  electronics: string;
  beautyHealth: string;
  fashion: string;
  kids: string;
  help: string;
  profile: string;
  logout: string;
  login: string;
  signUp: string;
  bestQualityBestPrices: string;
  bigSalesElectronics: string;
  shopNow: string;
  explore: string;
  quickLinks: string;
  customerCare: string;
  contactUs: string;
  accessories: string;
  newArrivals: string;
  myAccount: string;
  orderHistory: string;
  trackOrder: string;
  termsAndConditions: string;
  privacyPolicy: string;
  yourEmail: string;
  allRightsReserved: string;
  loginTitle: string;
  signupTitle: string;
  username: string;
  password: string;
  phone: string;
  confirmPassword: string;
  signingIn: string;
  creatingAccount: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  categoryAllProducts: string;
  categoryParfum: string;
  productsCategories: string;
  productsSortBy: string;
  productsNewest: string;
  productsLowPrice: string;
  productsHighPrice: string;
  addToWishlist: string;
  removeFromWishlist: string;
  addCart: string;
  buyNow: string;
  noProductsFound: string;
};

const en: TranslationMap = {
  language: "Language",
  search: "Search",
  home: "Home",
  products: "Products",
  electronics: "Electronics",
  beautyHealth: "Beauty & Health",
  fashion: "Fashion",
  kids: "Kids",
  help: "Help",
  profile: "Profile",
  logout: "Logout",
  login: "Login",
  signUp: "Sign Up",
  bestQualityBestPrices: "Best quality, Best prices.",
  bigSalesElectronics: "Big Sales for Electronics",
  shopNow: "Shop Now",
  explore: "Explore",
  quickLinks: "Quick Links",
  customerCare: "Customer Care",
  contactUs: "Contact Us",
  accessories: "Accessories",
  newArrivals: "New Arrivals",
  myAccount: "My Account",
  orderHistory: "Order History",
  trackOrder: "Track Order",
  termsAndConditions: "Terms & Conditions",
  privacyPolicy: "Privacy Policy",
  yourEmail: "Your email...",
  allRightsReserved: "All rights reserved.",
  loginTitle: "Login",
  signupTitle: "Sign up",
  username: "Username",
  password: "Password",
  phone: "Phone",
  confirmPassword: "Confirm password",
  signingIn: "Signing in...",
  creatingAccount: "Creating account...",
  dontHaveAccount: "Don't have an account? Sign up",
  alreadyHaveAccount: "Already have an account? Login",
  categoryAllProducts: "All Products",
  categoryParfum: "Parfum",
  productsCategories: "Categories",
  productsSortBy: "Sort By",
  productsNewest: "Newest",
  productsLowPrice: "Low Price",
  productsHighPrice: "High Price",
  addToWishlist: "Add to wishlist",
  removeFromWishlist: "Remove from wishlist",
  addCart: "Add Cart",
  buyNow: "Buy Now",
  noProductsFound: "No products found.",
};

const uz: TranslationMap = {
  language: "Til",
  search: "Qidirish",
  home: "Bosh sahifa",
  products: "Mahsulotlar",
  electronics: "Elektronika",
  beautyHealth: "Go'zallik va sog'liq",
  fashion: "Moda",
  kids: "Bolalar",
  help: "Yordam",
  profile: "Profil",
  logout: "Chiqish",
  login: "Kirish",
  signUp: "Ro'yxatdan o'tish",
  bestQualityBestPrices: "Eng yaxshi sifat, eng yaxshi narxlar.",
  bigSalesElectronics: "Elektronika uchun katta chegirmalar",
  shopNow: "Hozir xarid qiling",
  explore: "Ko'rib chiqing",
  quickLinks: "Tezkor havolalar",
  customerCare: "Mijozlarga xizmat",
  contactUs: "Biz bilan bog'laning",
  accessories: "Aksessuarlar",
  newArrivals: "Yangi kelganlar",
  myAccount: "Mening akkauntim",
  orderHistory: "Buyurtmalar tarixi",
  trackOrder: "Buyurtmani kuzatish",
  termsAndConditions: "Foydalanish shartlari",
  privacyPolicy: "Maxfiylik siyosati",
  yourEmail: "Emailingiz...",
  allRightsReserved: "Barcha huquqlar himoyalangan.",
  loginTitle: "Kirish",
  signupTitle: "Ro'yxatdan o'tish",
  username: "Foydalanuvchi nomi",
  password: "Parol",
  phone: "Telefon",
  confirmPassword: "Parolni tasdiqlang",
  signingIn: "Kirilmoqda...",
  creatingAccount: "Akkaunt yaratilmoqda...",
  dontHaveAccount: "Akkauntingiz yo'qmi? Ro'yxatdan o'ting",
  alreadyHaveAccount: "Akkauntingiz bormi? Kiring",
  categoryAllProducts: "Barcha mahsulotlar",
  categoryParfum: "Atirlar",
  productsCategories: "Kategoriyalar",
  productsSortBy: "Saralash",
  productsNewest: "Eng yangilari",
  productsLowPrice: "Arzon narx",
  productsHighPrice: "Yuqori narx",
  addToWishlist: "Sevimlilarga qo'shish",
  removeFromWishlist: "Sevimlilardan olib tashlash",
  addCart: "Savatga qo'shish",
  buyNow: "Hozir sotib olish",
  noProductsFound: "Mahsulot topilmadi.",
};

const ko: TranslationMap = {
  language: "언어",
  search: "검색",
  home: "홈",
  products: "상품",
  electronics: "전자제품",
  beautyHealth: "뷰티 & 건강",
  fashion: "패션",
  kids: "키즈",
  help: "도움말",
  profile: "프로필",
  logout: "로그아웃",
  login: "로그인",
  signUp: "회원가입",
  bestQualityBestPrices: "최고의 품질, 최고의 가격.",
  bigSalesElectronics: "전자제품 대규모 할인",
  shopNow: "지금 쇼핑",
  explore: "둘러보기",
  quickLinks: "빠른 링크",
  customerCare: "고객 지원",
  contactUs: "문의하기",
  accessories: "액세서리",
  newArrivals: "신상품",
  myAccount: "내 계정",
  orderHistory: "주문 내역",
  trackOrder: "주문 추적",
  termsAndConditions: "이용 약관",
  privacyPolicy: "개인정보 처리방침",
  yourEmail: "이메일을 입력하세요...",
  allRightsReserved: "모든 권리 보유.",
  loginTitle: "로그인",
  signupTitle: "회원가입",
  username: "사용자 이름",
  password: "비밀번호",
  phone: "전화번호",
  confirmPassword: "비밀번호 확인",
  signingIn: "로그인 중...",
  creatingAccount: "계정 생성 중...",
  dontHaveAccount: "계정이 없으신가요? 회원가입",
  alreadyHaveAccount: "이미 계정이 있나요? 로그인",
  categoryAllProducts: "전체 상품",
  categoryParfum: "향수",
  productsCategories: "카테고리",
  productsSortBy: "정렬 기준",
  productsNewest: "최신순",
  productsLowPrice: "낮은 가격",
  productsHighPrice: "높은 가격",
  addToWishlist: "위시리스트에 추가",
  removeFromWishlist: "위시리스트에서 제거",
  addCart: "장바구니 추가",
  buyNow: "지금 구매",
  noProductsFound: "상품을 찾을 수 없습니다.",
};

export const translations: Record<SupportedLanguage, TranslationMap> = {
  en,
  uz,
  ko,
};

export type TranslationKey = keyof TranslationMap;
