import { QueryInterface } from "sequelize";
import { userFourId, userFiveTeenId, userFourTeenId, userSevenId, userSixId, userFiveId, shopOneId, sellerProfileOneId, sellerProfileSixId, sellerProfileFiveId, shopThreeId, sellerProfileFourId, sellerProfileThreeId, sellerProfileTwoId, shopFourId, shopTwoId, shopFiveId, shopSixId, paymentFiveId, paymentFourId, paymentSixId, paymentThreeId, paymentTwoId } from "../../types/uuid";

const sellerProfileOne = {
    id:sellerProfileOneId,
    userId: userFourId,
    shopsId: shopOneId,
    paymentMethodId:paymentFiveId,
    businessName:"Paccy Shop 250",
    tin:"1234567",
    rdbDocument:"https://res.cloudinary.com/du0vvcuiz/image/upload/v1724088050/qm9svaanorpl8wkosaio.pdf",
    terms:true,
    requestStatus: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date()
}

const sellerProfileTwo = {
    id: sellerProfileTwoId,
    userId: userFiveId,
    shopsId: shopFiveId,
    paymentMethodId:paymentTwoId,
    businessName:"Shop 509",
    tin:"2345678",
    rdbDocument:"https://res.cloudinary.com/du0vvcuiz/image/upload/v1724088050/qm9svaanorpl8wkosaio.pdf",
    terms:true,
    requestStatus: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date()
}
const sellerProfileThree = {
    id:sellerProfileThreeId,
    userId: userSixId,
    shopsId: shopFourId,
    paymentMethodId:paymentThreeId,
    businessName:"electronic Shop 509",
    tin:"3456789",
    rdbDocument:"https://res.cloudinary.com/du0vvcuiz/image/upload/v1724088050/qm9svaanorpl8wkosaio.pdf",
    terms:true,
    requestStatus: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date()
}
const sellerProfileFour = {
    id:sellerProfileFourId,
    userId: userSevenId,
    shopsId: shopTwoId,
    paymentMethodId:paymentFourId,
    businessName:"Paccy Shop 509",
    tin:"4567890",
    rdbDocument:"https://res.cloudinary.com/du0vvcuiz/image/upload/v1724088050/qm9svaanorpl8wkosaio.pdf",
    terms:true,
    requestStatus: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date()
}
const sellerProfileFive = {
    id:sellerProfileFiveId,
    userId: userFourTeenId,
    shopsId: shopThreeId,
    paymentMethodId:paymentFiveId,
    businessName:"Shoes Shop 509",
    tin:"5678901",
    rdbDocument:"https://res.cloudinary.com/du0vvcuiz/image/upload/v1724088050/qm9svaanorpl8wkosaio.pdf",
    terms:true,
    requestStatus: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date()
}
const sellerProfileSix = {
    id:sellerProfileSixId,
    userId: userFiveTeenId,
    shopsId: shopSixId,
    paymentMethodId:paymentSixId,
    businessName:"electronics Shop 509",
    tin:"6789012",
    rdbDocument:"https://res.cloudinary.com/du0vvcuiz/image/upload/v1724088050/qm9svaanorpl8wkosaio.pdf",
    terms:true,
    requestStatus: "Accepted",
    createdAt: new Date(),
    updatedAt: new Date()
}

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("sellerProfiles", [sellerProfileOne, sellerProfileTwo,sellerProfileThree,sellerProfileFour,sellerProfileFive,sellerProfileSix ]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("sellerProfiles", {});
};