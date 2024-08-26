/* eslint-disable comma-dangle */
import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import {
  productOneId,
  productTwoId,
  productThreeId,
  productFourId,
  productFiveId,
  productSixId,
  productSevenId,
  productEightId,
  productNineId,
  productTenId,
  productElevenId,
  productTwelveId,
  shopOneId,
  shopTwoId,
  shopThreeId,
  shopFourId,
} from "../../types/uuid";

const productOne = {
  id: productOneId,
  shopId: shopFourId,
  name: "Shoes",
  description:
    "Shoes are a crucial part of your wardrobe, providing not only style but also comfort and support for your feet.",
  price: 32.21,
  discount: "10%",
  category: "Dress Shoes",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292585/y08jmucc6xbadatgbros.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292588/k9rnetp1oru4uefpuawt.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292585/mjyihb0m5df3s181uikj.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292586/dk8lf5sj1boxckt5no4e.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwo = {
  id: productTwoId,
  shopId: shopThreeId,
  name: "Women Bag",
  description: "A women's bag is a fashionable and functional accessory designed to carry personal belongings. Available in various styles, sizes, and materials, women's bags cater to diverse needs and preferences. From elegant clutches and chic handbags to spacious totes and practical backpacks, each type serves a unique purpose. High-quality women's bags offer a blend of style, durability, and convenience, making them essential for everyday use, special occasions, and professional settings.",
  price: 19.99,
  discount: "13%",
  category: "Handbags",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292712/zbe7e92cktbfehroc57j.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292712/qfvi9yznjgi85i9hnaks.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292709/mdxilt3k9hqv9gl1xflm.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720292712/e8jrxuvdxqncminmm6on.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThree = {
  id: productThreeId,
  shopId: shopTwoId,
  name: "Flat TV",
  description:
    "A flat TV is a sleek and modern television designed to offer high-quality visuals and a seamless viewing experience. Featuring a slim profile and advanced display technology, such as LED, OLED, or QLED, flat TVs deliver vibrant colors, sharp contrasts, and clear images. They are available in various sizes to fit different spaces, from compact models for bedrooms to large screens for home theaters. ",
  price: 698.88,
  discount: "8%",
  category: "Electronics",
  expiryDate: new Date("2040-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293466/i4fufpae6uxecwipwhy7.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293458/dgc4ypglwp8oldm98sfc.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293473/fmuayv5rk8yje1yxfjze.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293465/uspbb3jciiebecqbbgoq.jpg"
  ],
  quantity: 150,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFour = {
  id: productFourId,
  shopId: shopOneId,
  name: "Cable Mouse",
  description:
    "A cable mouse is a reliable and efficient pointing device for computers, featuring a wired connection for consistent performance and responsiveness. It offers precision and control, making it ideal for tasks ranging from everyday browsing to detailed graphic design. The cable ensures a stable connection without the need for batteries, and many models come with ergonomic designs to enhance comfort during extended use.",
  price: 3,
  discount: "11%",
  category: "Computer Accessories",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293675/ghh9flh4o2omidhmmzzy.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293673/feghcc1diy208eqycuqo.png",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293676/mbvfslvopakl3v3afh1f.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293675/uujwpowhvokogjjbs8zt.png"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFive = {
  id: productFiveId,
  shopId: shopFourId,
  name: "Watch",
  description:
    "A watch is a timeless accessory that combines functionality with style, offering a convenient way to tell time while also making a fashion statement. Available in various designs, from classic analog to sleek digital models, watches cater to different preferences and occasions. They often feature durable materials like stainless steel or leather, with advanced features such as water resistance and additional functionalities like chronographs or smart capabilities.",
  price: 38.91,
  discount: "17%",
  category: "Dress Watches",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293781/aupwephwsobjjeyzuhhw.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293781/bkl7nxjaxu98ztuujigf.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293781/triqmiam6sk1ctzl0wlg.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293778/dhfmdrc7wfpezqu1ows1.jpg"
  ],
  quantity: 250,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productSix = {
  id: productSixId,
  shopId: shopFourId,
  name: "Necklace",
  description:
    "A necklace is a versatile piece of jewelry worn around the neck, enhancing one's attire with elegance and personal flair. Available in an array of styles and materials, necklaces range from delicate chains adorned with pendants to elaborate designs featuring gemstones or precious metals. They serve as symbols of fashion, sentimentality, or cultural significance, complementing both casual and formal outfits with grace. Whether chosen for everyday wear or special occasions, a necklace adds a touch of sophistication and individuality to any ensemble.",
  price: 198.62,
  discount: "18%",
  category: "Dress",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293966/trukezkdnmbtr0p0t5uh.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293966/pv4b33qzatrhvrwijicc.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293966/njjjflqcu0yy9q8exluc.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720293967/ezkikavntcwj2usjuukc.jpg"
  ],
  quantity: 350,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productSeven = {
  id: productSevenId,
  shopId: shopFourId,
  name: "Microphone",
  description:
    "A microphone, commonly referred to as a mic, is an essential audio device used to capture sound. It converts sound waves into electrical signals, making it crucial for a wide range of applications including recording, broadcasting, public speaking, and communication. Microphones come in various types, such as dynamic, condenser, and ribbon, each designed for specific uses and environments. With advancements in technology, modern microphones offer high-fidelity audio capture, noise reduction, and wireless capabilities, ensuring clear and accurate sound reproduction.",
  price: 50,
  discount: "21%",
  category: "Electronics",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294206/ohcd89wfptzywhez2azv.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294205/cgs68wubrksdsai8qgok.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294205/eiml7si0rsklsmye8l8w.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294204/ovkr2riub7vmzx9b9h5s.jpg"
  ],
  quantity: 150,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productEight = {
  id: productEightId,
  shopId: shopFourId,
  name: "Camera",
  description:
    "A camera is a versatile device used to capture and record images and videos, preserving moments with clarity and detail. Cameras come in various types, including digital, DSLR, mirrorless, and action cameras, each catering to different photography needs and skill levels. Equipped with advanced features like high-resolution sensors, optical zoom, and various shooting modes, modern cameras allow users to capture everything from stunning landscapes to fast-moving action with precision. Whether for professional photography, personal memories, or creative projects, a camera is an indispensable tool for visual storytelling.",
  price: 912.16,
  discount: "22%",
  category: "Electronics",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294521/cce1ffu7uw3j2vg9s2vl.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294523/wspe9bn0alzbbpvsqgsh.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294521/yw42mlyu0bxor9lkbbdq.jpg",
    "https://res.cloudinary.com/djrmfg6k9/image/upload/v1720294523/jdnigjgvatv3rw5ym7yz.jpg"
  ],
  quantity: 250,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};
const productNine = {
  id: productNineId,
  shopId: shopFourId,
  name: "Fashion T-Cross Paints",
  description:
    "Fashion Solid Color Work Casual Multiple Pockets Men's Cargo Pants Classic Waist Drawcord Pure Cotton Youth Tide Male Trousers",
  price: 7.99,
  discount: "7%",
  category: "Men's Clothes",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923392/auilcu7ibtttacjonozl.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923393/egibnnshd2jmt335yzma.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923396/jojvqx5z6dunixeep1vd.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923392/gem1f2uotaw3rgcpd95z.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTen = {
  id: productTenId,
  shopId: shopFourId,
  name: "Solid Black Label Paints",
  description:
    "Fashion Solid Color Work Casual Multiple Pockets Men's Cargo Pants Classic Waist Drawcord Pure Cotton Youth Tide Male Trousers",
  price: 15.99,
  discount: "15%",
  category: "Men's Clothes",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/eoknuaiwroxnvg7zhuvm.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/xm6k5zjjbmy8viz01y0w.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/tfxcklr1dxrlyczwz0uv.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/ucazormu3vd452t0ijv2.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/smxezgpkcps3cb0fvdq7.webp"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productEleven = {
  id: productElevenId,
  shopId: shopFourId,
  name: "Red Sneakers",
  description:
    "Red Sneakers Women Shoes Woman Tennis Shoes Canvas Shoe Female Casual Shoes Ladies Sport Shoes Platform Sneaker Hollow Out Shoes",
  price: 20.99,
  discount: "6%",
  category: "Women's Shoes",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  "images": [
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/ckqqguqwcg6gplhpp2za.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/itheprnho9dfqioddpmi.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/klb3npd418trkupivlnd.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/rxsfmonky2iegr7hnsbu.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/n8g2jwvsqip1d947flql.jpg"
  ],
  quantity: 5,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwelve = {
  id: productTwelveId,
  shopId: shopFourId,
  name: "Second Hand 4G Vivo Fone",
  description:
    "[Need more Clearance fee per phone] Second-hand Vivo S1 4G LTE Cell Phone Helio P70 Android 9.0 6.38 2340X1080 6GB RAM 256GB ROM 32.0MP NFC Screen Fingerprint",
  price: 199.99,
  discount: "25%",
  category: "Electronic Devices",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://m.media-amazon.com/images/I/61ZBxbrVF0L._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/61ZBxbrVF0L._SX425_.jpg",
    "https://m.media-amazon.com/images/I/61ZBxbrVF0L._SX425_.jpg",
    "https://m.media-amazon.com/images/I/51u0EwClwkL._SL1200_.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirteen = {
  id: uuidv4(),
  shopId: shopFourId,
  name: "Stainless Steel Kitchen Knife Set",
  description: "Professional-grade 6-piece knife set with ergonomic handles and a wooden block.",
  price: 149.99,
  discount: "12%",
  category: "Kitchen & Dining",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free knife sharpener",
  images: [
    "https://m.media-amazon.com/images/I/71WgsPCbfpL._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/61HTJjDOk9L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/717Slt7NB-L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71nL425Q-dL._AC_SL1500_.jpg"
  ],
  quantity: 40,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFourteen = {
  id: uuidv4(),
  shopId: shopFourId,
  name: "Organic Cotton Bath Towel Set",
  description: "Luxurious 4-piece towel set made from 100% organic cotton, soft and absorbent.",
  price: 59.99,
  discount: "5%",
  category: "Home & Bath",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free hand towel",
  images: [
    "https://m.media-amazon.com/images/I/811pV4BCp8L._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/81jS3yV68HL._AC_SX466_.jpg",
    "https://m.media-amazon.com/images/I/51d+uaPNhoL._AC_SX450_.jpg",
    "https://m.media-amazon.com/images/I/81Xo1RLXOHL._AC_SY679_.jpg"
  ],
  quantity: 75,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFifteen = {
  id: uuidv4(),
  shopId: shopFourId,
  name: "Wireless Gaming Mouse",
  description: "High-precision optical sensor, customizable RGB lighting, and ergonomic design for extended gaming sessions.",
  price: 79.99,
  discount: "15%",
  category: "Computer Accessories",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free mousepad",
  images: [
    "https://m.media-amazon.com/images/I/71CdNUA46fL._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/81SpZ0I3VsL._AC_SY355_.jpg",
    "https://m.media-amazon.com/images/I/71Tu9wPQBmL._AC_SY355_.jpg",
    "https://m.media-amazon.com/images/I/81w1d1EA4PL._AC_SY355_.jpg"
  ],
  quantity: 100,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productSixteen = {
  id: uuidv4(),
  shopId: shopFourId,
  name: "Portable Bluetooth Speaker",
  description: "Waterproof, 20-hour battery life, and rich, immersive sound for outdoor adventures.",
  price: 89.99,
  discount: "10%",
  category: "Electronics",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free carrying case",
  images: [
    "https://m.media-amazon.com/images/I/61nNxaKDi+L._AC_SY355_.jpg",
    "https://m.media-amazon.com/images/I/61TtyCx5uRL._AC_SX355_.jpg",
    "https://m.media-amazon.com/images/I/71OwhqoZ91L._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/61kVGgL4wHL._AC_SX355_.jpg"
  ],
  quantity: 60,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productSeventeen = {
  id: uuidv4(),
  shopId: shopFourId,
  name: "Yoga Mat with Carrying Strap",
  description: "Eco-friendly, non-slip yoga mat with alignment lines and a convenient carrying strap.",
  price: 39.99,
  discount: "7%",
  category: "Sports & Fitness",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free yoga block",
  images: [
    "https://m.media-amazon.com/images/I/81SNpiAhomL._AC_SX522_.jpg",
    "https://m.media-amazon.com/images/I/91MfCBLpTHL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81a94wiXlHL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81Z+8EmGDsL._AC_SX425_.jpg"
  ],
  quantity: 120,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productEighteen = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Stainless Steel Water Bottle",
  description: "Vacuum-insulated, 24oz capacity, keeps drinks cold for 24 hours or hot for 12 hours.",
  price: 29.99,
  discount: "0%",
  category: "Outdoor & Recreation",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free bottle brush",
  images: [
    "https://m.media-amazon.com/images/I/61ao0EKAJVL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71GkO9JEloL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81W14co9TFL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81HnygZnY3L._AC_SX425_.jpg"
  ],
  quantity: 200,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productNineteen = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Wireless Noise-Cancelling Headphones",
  description: "Over-ear headphones with active noise cancellation, 30-hour battery life, and premium audio quality.",
  price: 249.99,
  discount: "18%",
  category: "Electronics",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free travel case",
  images: [
    "https://m.media-amazon.com/images/I/51V1bf76cML.__AC_SX300_SY300_QL70_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/819v7Kl1vOL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81uJSwMRy+L._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/61I93KdTjvL._AC_UF350,350_QL80_FMwebp_.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwenty = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Smart Home Security Camera",
  description: "1080p HD video, two-way audio, night vision, and mobile app control for home security.",
  price: 129.99,
  discount: "8%",
  category: "Smart Home",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "1-month free cloud storage",
  images: [
    "https://m.media-amazon.com/images/I/61uMgGd9F2L._SX425_.jpg",
    "https://m.media-amazon.com/images/I/31tp0vzZwRL._SY355_.jpg",
    "https://m.media-amazon.com/images/I/61fblR+WX+L._SY355_.jpg",
    "https://m.media-amazon.com/images/I/61WAFlrR8lL._SY355_.jpg"
  ],
  quantity: 80,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyOne = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Men's Slim Fit Dress Shirt",
  description: "Wrinkle-resistant cotton blend dress shirt, perfect for office or formal events.",
  price: 45.99,
  discount: "5%",
  category: "Men's Clothing",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free collar stays",
  images: [
    "https://m.media-amazon.com/images/I/81ZRSoC3NjL._AC_SY500_.jpg",
    "https://m.media-amazon.com/images/I/91IKWiX-fTL._AC_SX385_.jpg",
    "https://m.media-amazon.com/images/I/81skTJnu1tL._AC_SY445_.jpg",
    "https://m.media-amazon.com/images/I/81HAvVMzgXL._AC_SY445_.jpg"
  ],
  quantity: 100,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyTwo = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Women's Running Shoes",
  description: "Lightweight, breathable running shoes with superior cushioning and support.",
  price: 89.99,
  discount: "15%",
  category: "Women's Footwear",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free pair of running socks",
  images: [
    "https://m.media-amazon.com/images/I/818VN+2UJ1L._AC_SY395_.jpg",
    "https://m.media-amazon.com/images/I/71EseWePchL._AC_SY395_.jpg",
    "https://m.media-amazon.com/images/I/71Tf1fKo56L._AC_SY395_.jpg",
    "https://m.media-amazon.com/images/I/71JzFFahOTL._AC_SY395_.jpg"
  ],
  quantity: 75,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyThree = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Digital Kitchen Scale",
  description: "Precise measuring up to 11 lbs, with tare function and multiple unit options.",
  price: 24.99,
  discount: "0%",
  category: "Kitchen & Dining",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free recipe e-book",
  images: [
    "https://m.media-amazon.com/images/I/61hEtbJv3YL._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/81Fk2GoyzxL._AC_SX466_.jpg",
    "https://m.media-amazon.com/images/I/81jW5if9hVL._AC_SX466_.jpg",
    "https://m.media-amazon.com/images/I/71rIQgts5VL._AC_SX466_.jpg"
  ],
  quantity: 120,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyFour = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Facial Cleansing Brush",
  description: "Waterproof electric facial cleansing brush with multiple speed settings.",
  price: 39.99,
  discount: "10%",
  category: "Beauty & Personal Care",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free travel pouch",
  images: [
    "https://m.media-amazon.com/images/I/51WeopkrVXL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/61eveVnNt-L._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/712P5VDLrdL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/711Ot6dTKgL._AC_SX425_.jpg"
  ],
  quantity: 90,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyFive = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Adjustable Dumbbell Set",
  description: "Space-saving adjustable dumbbells, 5-52.5 lbs each, perfect for home gyms.",
  price: 299.99,
  discount: "7%",
  category: "Sports & Fitness",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free workout guide",
  images: [
    "https://m.media-amazon.com/images/I/71BE37ZZfLL._AC_SX522_.jpg",
    "https://m.media-amazon.com/images/I/71IvvSJaVKL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71MKlnbX1OL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/717tPaaj+WL._AC_SX425_.jpg"
  ],
  quantity: 30,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentySix = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Ergonomic Office Chair",
  description: "Adjustable height and lumbar support, breathable mesh back for comfort.",
  price: 179.99,
  discount: "12%",
  category: "Home Office",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free desk mat",
  images: [
    "https://m.media-amazon.com/images/I/71jeulFxQ9L._AC_SY679_.jpg",
    "https://m.media-amazon.com/images/I/61C33xw7O1L._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/61OKjqrqS8L._AC_SX450_.jpg",
    "https://m.media-amazon.com/images/I/71U7PpAeQNL._AC_SY450_.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentySeven = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Smart WiFi Light Bulb",
  description: "Color-changing LED bulb, voice control compatible, app-controlled scheduling.",
  price: 29.99,
  discount: "5%",
  category: "Smart Home",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free smart plug",
  images: [
    "https://m.media-amazon.com/images/I/71cORaWaIjL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/61c799hs0BL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/715yoih6zkL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/716bTfE9d-L._AC_SX425_.jpg"
  ],
  quantity: 150,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyEight = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Leather Wallet for Men",
  description: "Genuine leather bifold wallet with RFID blocking technology.",
  price: 49.99,
  discount: "0%",
  category: "Accessories",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free money clip",
  images: [
    "https://m.media-amazon.com/images/I/81BqpJqfb0L._AC_SX466_.jpg",
    "https://m.media-amazon.com/images/I/91WMzMO7sEL._AC_SX385_.jpg",
    "https://m.media-amazon.com/images/I/81P2-qgBIrL._AC_SX385_.jpg",
    "https://m.media-amazon.com/images/I/91tZ7AzVqoL._AC_SX385_.jpg"
  ],
  quantity: 100,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwentyNine = {
  id: uuidv4(),
  shopId: shopThreeId,
  name: "Electric Coffee Grinder",
  description: "Stainless steel blade grinder with multiple grind settings for perfect coffee.",
  price: 34.99,
  discount: "8%",
  category: "Kitchen & Dining",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free coffee scoop",
  images: [
    "https://m.media-amazon.com/images/I/61o+Ocx9bEL._AC_SY879_.jpg",
    "https://m.media-amazon.com/images/I/81yrepDdufL._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/91gmMyxEPYL._AC_SY450_.jpg",
    "https://m.media-amazon.com/images/I/91HnlUd8a1L._AC_SY450_.jpg"
  ],
  quantity: 80,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirty = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Wireless Car Charger Mount",
  description: "Fast-charging, auto-clamping phone mount for car dashboard or air vent.",
  price: 39.99,
  discount: "10%",
  category: "Automotive",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free USB car charger",
  images: [
    "https://m.media-amazon.com/images/I/61+HUksN4kL._AC_SX522_.jpg",
    "https://m.media-amazon.com/images/I/71VfjPWsJaL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/71VfjPWsJaL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/71rI7Z23mlL._AC_SX425_.jpg"
  ],
  quantity: 70,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyOne = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Portable Camping Stove",
  description: "Compact propane camping stove with two burners, perfect for outdoor cooking.",
  price: 69.99,
  discount: "15%",
  category: "Outdoor & Recreation",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free carrying case",
  images: [
    "https://m.media-amazon.com/images/I/61b-Kz+go7L._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81+AzZk8XYL._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/91Q19m20j3L._AC_SX425_.jpg",
    "https://m.media-amazon.com/images/I/81LnVpenhlL._AC_SX425_.jpg"
  ],
  quantity: 40,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyTwo = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Wireless Gaming Controller",
  description: "Ergonomic design, customizable buttons, compatible with PC and mobile devices.",
  price: 59.99,
  discount: "5%",
  category: "Gaming",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free phone clip",
  images: [
    "https://m.media-amazon.com/images/I/81a7j-yI4fL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71aPcPyycTL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71aPcPyycTL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71rbXxnsD4L._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 100,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyThree = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Wooden Chess Set",
  description: "Handcrafted wooden chess set with felt-bottom pieces and folding board.",
  price: 79.99,
  discount: "0%",
  category: "Toys & Games",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free strategy guide",
  images: [
    "https://m.media-amazon.com/images/I/51EZxgMWp6L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/51ybceeIxGL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/51hNYZzJuLL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/51dwIAfxRGL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 30,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyFour = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Indoor Herb Garden Kit",
  description: "Self-watering planter with LED grow light, perfect for kitchen herbs.",
  price: 49.99,
  discount: "10%",
  category: "Home & Garden",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free herb seed pack",
  images: [
    "https://m.media-amazon.com/images/I/915h+rx-IPL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81iOaqPKZkL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/91O4AOsy9ZL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/813fmDPwZKL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 60,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyFive = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Digital Drawing Tablet",
  description: "10-inch graphic tablet with 8192 pressure levels and wireless stylus.",
  price: 129.99,
  discount: "12%",
  category: "Electronics",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free software bundle",
  images: [
    "https://m.media-amazon.com/images/I/61eG0iYBj+L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71uJgklbrWL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71PjwM4GPXL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71M3iPoRppL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 40,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtySix = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Robotic Vacuum Cleaner",
  description: "Smart navigation, app control, and self-charging for effortless cleaning.",
  price: 249.99,
  discount: "15%",
  category: "Home Appliances",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free replacement filters",
  images: [
    "https://m.media-amazon.com/images/I/61RNw+-A3ZL._AC_SR350,526_FMwebp_QL65_.jpg",
    "https://m.media-amazon.com/images/I/81Tx60qVJUL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81OX1-9pXiL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81PdDi27V-L._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 25,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtySeven = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Leather Messenger Bag",
  description: "Genuine leather bag with padded laptop compartment and multiple pockets.",
  price: 119.99,
  discount: "8%",
  category: "Bags & Luggage",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free leather care kit",
  images: [
    "https://m.media-amazon.com/images/I/81-NI2QPiuL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/81Lkm487xWL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/81HOL4GmRQL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/81saNPKx14L._AC_UY1000_.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyEight = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Wireless Meat Thermometer",
  description: "Bluetooth-enabled thermometer with app alerts and preset temperatures.",
  price: 59.99,
  discount: "5%",
  category: "Kitchen & Dining",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free grill mitt",
  images: [
    "https://m.media-amazon.com/images/I/71xNVR+bC-L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/717434yqMLL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71gDfDKO3YL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71NDzFiuqrL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 75,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThirtyNine = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Smart Door Lock",
  description: "Keyless entry with fingerprint, code, and smartphone app access.",
  price: 199.99,
  discount: "10%",
  category: "Smart Home",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free installation guide",
  images: [
    "https://m.media-amazon.com/images/I/81cQsOTh8lL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81XHSWNDozL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81PRyrbd57L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81i64SMgOHL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 40,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productForty = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Portable Espresso Maker",
  description: "Manual espresso maker for travel, compatible with ground coffee and pods.",
  price: 69.99,
  discount: "0%",
  category: "Kitchen & Dining",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free coffee sampler",
  images: [
    "https://m.media-amazon.com/images/I/61QEILMuuUL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61QEILMuuUL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61TWH5Weu4L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61lshDGadEL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 60,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyOne = {
  id: uuidv4(),
  shopId: shopTwoId,
  name: "Wireless Earbuds",
  description: "True wireless earbuds with noise cancellation and 24-hour battery life.",
  price: 129.99,
  discount: "15%",
  category: "Electronics",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free silicone ear tips set",
  images: [
    "https://m.media-amazon.com/images/I/81MFfvWGAjL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71p1AqYSZJL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71QRKXPptOL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81hHLSbh-QL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 100,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyTwo = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Yoga Wheel",
  description: "Durable yoga wheel for stretching and improving flexibility, supports up to 500 lbs.",
  price: 39.99,
  discount: "5%",
  category: "Sports & Fitness",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free yoga strap",
  images: [
    "https://m.media-amazon.com/images/I/71fDg0xg-AL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61kNrW72WYL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/619jeV12eNL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/717tdw6XgfL._AC_UF1000,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 80,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyThree = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Smart Wi-Fi Air Purifier",
  description: "HEPA air purifier with app control, air quality monitor, and quiet operation.",
  price: 179.99,
  discount: "12%",
  category: "Home Appliances",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free replacement filter",
  images: [
    "https://m.media-amazon.com/images/I/71Qdt55G77L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81X1WOgrVqL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81ZVCj8DlZL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71Xgi97OfgL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyFour = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Electric Wine Opener",
  description: "Rechargeable wine bottle opener with foil cutter and LED charging base.",
  price: 29.99,
  discount: "0%",
  category: "Kitchen & Dining",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free wine stopper",
  images: [
    "https://m.media-amazon.com/images/I/61x-GTZmVeL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/61x-GTZmVeL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/5185rWwoqlL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/51lBKX3PBnL._AC_SL1500_.jpg",
  ],
  quantity: 120,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyFive = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Leather Watch Box",
  description: "12-slot watch organizer with glass top and lock, lined with soft velvet.",
  price: 59.99,
  discount: "8%",
  category: "Accessories",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free microfiber cleaning cloth",
  images: [
    "https://m.media-amazon.com/images/I/71m5Vsxvd5L._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71SFDlgVRwL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71NFPp2MMYL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71VAQ7fIVUL._AC_SL1500_.jpg"
  ],
  quantity: 40,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortySix = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Portable Car Jump Starter",
  description: "1000A peak current, built-in flashlight, and USB charging ports for emergencies.",
  price: 79.99,
  discount: "10%",
  category: "Automotive",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free carrying case",
  images: [
    "https://m.media-amazon.com/images/I/7185pOyF43L._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71RazL1p3fL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71aozVY2PtL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71AQ3dXl8nL._AC_UF1000,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 70,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortySeven = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Digital Bathroom Scale",
  description: "Smart scale with body composition analysis and smartphone app sync.",
  price: 49.99,
  discount: "5%",
  category: "Health & Wellness",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free body tape measure",
  images: [
    "https://m.media-amazon.com/images/I/61bAnOXDl7L._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61lfPOhZ9TL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61aYPAPfbrL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61eyKWTHUXL._AC_UF1000,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 90,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyEight = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Collapsible Silicone Water Bottle",
  description: "BPA-free, leak-proof, and easy to clean, perfect for travel and outdoor activities.",
  price: 19.99,
  discount: "0%",
  category: "Outdoor & Recreation",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free carabiner clip",
  images: [
    "https://m.media-amazon.com/images/I/71V9tML-zxL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81Uc6UYiieL._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81AHZG4Nr7L._AC_UF1000,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81I35txcM2L._AC_UF1000,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 150,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFortyNine = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Adjustable Laptop Stand",
  description: "Ergonomic aluminum stand with 6 adjustable angles, suitable for laptops up to 17 inches.",
  price: 39.99,
  discount: "7%",
  category: "Office Products",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free cable organizer",
  images: [
    "https://m.media-amazon.com/images/I/71G8rdQin3L._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81dPKo1DPdL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71pTnwyCmML._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71aUyb+rHNL._AC_SL1500_.jpg"
  ],
  quantity: 80,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFifty = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Sunrise Alarm Clock",
  description: "Wake-up light with natural sunrise simulation, multiple sound options, and FM radio.",
  price: 45.99,
  discount: "10%",
  category: "Home & Bedroom",
  expiryDate: new Date("2050-12-31"),
  expired: false,
  bonus: "Free sleep mask",
  images: [
    "https://m.media-amazon.com/images/I/51q7d1TAcQL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61eeL5JROTL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/71jwX-21cTL._AC_UF894,1000_QL80_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/61Ce21ys7EL._AC_UF894,1000_QL80_FMwebp_.jpg"
  ],
  quantity: 60,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productFiftyOne = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Red Sneakers",
  description: "Red Sneakers Women Shoes Woman Tennis Shoes Canvas Shoe Female Casual Shoes Ladies Sport Shoes Platform Sneaker Hollow Out Shoes",
  price: 20.99,
  discount: "6%",
  category: "Women's Shoes",
  expiryDate: new Date("2050-12-31T00:00:00Z"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/ckqqguqwcg6gplhpp2za.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/itheprnho9dfqioddpmi.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/klb3npd418trkupivlnd.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/rxsfmonky2iegr7hnsbu.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924368/n8g2jwvsqip1d947flql.jpg"
  ],
  quantity: 5,
  status: "available",
  createdAt: new Date("2024-07-25T17:17:42.603Z"),
  updatedAt: new Date("2024-07-30T15:24:48.418562Z"),
};

const productFiftyTwo = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Fashion T-Cross Paints",
  description: "Fashion Solid Color Work Casual Multiple Pockets Men's Cargo Pants Classic Waist Drawcord Pure Cotton Youth Tide Male Trousers",
  price: 7.99,
  discount: "7%",
  category: "Men's Clothes",
  expiryDate: new Date("2050-12-31T00:00:00Z"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923392/auilcu7ibtttacjonozl.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923393/egibnnshd2jmt335yzma.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923396/jojvqx5z6dunixeep1vd.jpg",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721923392/gem1f2uotaw3rgcpd95z.jpg"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date("2024-07-25T17:17:42.603Z"),
  updatedAt: new Date("2024-07-25T17:17:42.603Z"),
};

const productFiftyThree = {
  id: uuidv4(),
  shopId: shopOneId,
  name: "Solid Black Label Paints",
  description: "Fashion Solid Color Work Casual Multiple Pockets Men's Cargo Pants Classic Waist Drawcord Pure Cotton Youth Tide Male Trousers",
  price: 15.99,
  discount: "15%",
  category: "Men's Clothes",
  expiryDate: new Date("2050-12-31T00:00:00Z"),
  expired: false,
  bonus: "Bonus 1",
  images: [
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/eoknuaiwroxnvg7zhuvm.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/xm6k5zjjbmy8viz01y0w.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/tfxcklr1dxrlyczwz0uv.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/ucazormu3vd452t0ijv2.webp",
    "https://res.cloudinary.com/du0vvcuiz/image/upload/v1721924072/smxezgpkcps3cb0fvdq7.webp"
  ],
  quantity: 50,
  status: "available",
  createdAt: new Date("2024-07-25T17:17:42.603Z"),
  updatedAt: new Date("2024-07-25T17:17:42.603Z"),
};

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkInsert("products", [
    productOne,
    productTwo,
    productThree,
    productFour,
    productFive,
    productSix,
    productSeven,
    productEight,
    productNine,
    productTen,
    productEleven,
    productTwelve,
    productThirteen, productFourteen, productFifteen, productSixteen, productSeventeen, productEighteen,
    productNineteen, productTwenty, productTwentyOne, productTwentyTwo, productTwentyThree, productTwentyFour,
    productTwentyFive, productTwentySix, productTwentySeven, productTwentyEight, productTwentyNine,
    productThirty, productThirtyOne, productThirtyTwo, productThirtyThree, productThirtyFour, productThirtyFive, productThirtySix,
    productThirtySeven, productThirtyEight, productThirtyNine, productForty, productFortyOne, productFortyTwo, productFortyThree,
    productFortyFour, productFortyFive, productFortySix, productFortySeven, productFortyEight, productFortyNine,
    productFifty, productFiftyOne, productFiftyTwo, productFiftyThree
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("products", {});
};