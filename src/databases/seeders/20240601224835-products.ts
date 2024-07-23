/* eslint-disable comma-dangle */
import { QueryInterface } from "sequelize";
import {
  productOneId,
  productTwoId,
  productThreeId,
  productFourId,
  productFiveId,
  productSixId,
  productSevenId,
  productEightId,
  shopOneId,
  shopTwoId,
} from "../../types/uuid";

const productOne = {
  id: productOneId,
  shopId: shopOneId,
  name: "Shoes",
  description:
    "Shoes are a crucial part of your wardrobe, providing not only style but also comfort and support for your feet.",
  price: 19.99,
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
  shopId: shopTwoId,
  name: "Women Bag",
  description: "A women's bag is a fashionable and functional accessory designed to carry personal belongings. Available in various styles, sizes, and materials, women's bags cater to diverse needs and preferences. From elegant clutches and chic handbags to spacious totes and practical backpacks, each type serves a unique purpose. High-quality women's bags offer a blend of style, durability, and convenience, making them essential for everyday use, special occasions, and professional settings.",
  price: 19.99,
  discount: "13%",
  category: "Handbags:",
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
  price: 19.99,
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
  price: 19.99,
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
  shopId: shopOneId,
  name: "Watch",
  description:
    "A watch is a timeless accessory that combines functionality with style, offering a convenient way to tell time while also making a fashion statement. Available in various designs, from classic analog to sleek digital models, watches cater to different preferences and occasions. They often feature durable materials like stainless steel or leather, with advanced features such as water resistance and additional functionalities like chronographs or smart capabilities.",
  price: 19.99,
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
  shopId: shopOneId,
  name: "Necklace",
  description:
    "A necklace is a versatile piece of jewelry worn around the neck, enhancing one's attire with elegance and personal flair. Available in an array of styles and materials, necklaces range from delicate chains adorned with pendants to elaborate designs featuring gemstones or precious metals. They serve as symbols of fashion, sentimentality, or cultural significance, complementing both casual and formal outfits with grace. Whether chosen for everyday wear or special occasions, a necklace adds a touch of sophistication and individuality to any ensemble.",
  price: 19.99,
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
  shopId: shopTwoId,
  name: "Microphone",
  description:
    "A microphone, commonly referred to as a mic, is an essential audio device used to capture sound. It converts sound waves into electrical signals, making it crucial for a wide range of applications including recording, broadcasting, public speaking, and communication. Microphones come in various types, such as dynamic, condenser, and ribbon, each designed for specific uses and environments. With advancements in technology, modern microphones offer high-fidelity audio capture, noise reduction, and wireless capabilities, ensuring clear and accurate sound reproduction.",
  price: 19.99,
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
  shopId: shopTwoId,
  name: "Camera",
  description:
    "A camera is a versatile device used to capture and record images and videos, preserving moments with clarity and detail. Cameras come in various types, including digital, DSLR, mirrorless, and action cameras, each catering to different photography needs and skill levels. Equipped with advanced features like high-resolution sensors, optical zoom, and various shooting modes, modern cameras allow users to capture everything from stunning landscapes to fast-moving action with precision. Whether for professional photography, personal memories, or creative projects, a camera is an indispensable tool for visual storytelling.",
  price: 19.99,
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
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("products", {});
};