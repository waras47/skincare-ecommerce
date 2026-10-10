import { AppError } from "../../middleware/errorHandler";
import { usersRepository } from "./users.repository";

export const usersService = {
  async getProfile(userId: string) {
    const user = await usersRepository.findById(BigInt(userId));
    if (!user) throw new AppError(404, "User not found");
    return user;
  },

  updateProfile(userId: string, data: Partial<{ name: string; skinType: string }>) {
    return usersRepository.updateProfile(BigInt(userId), data);
  },

  listAddresses(userId: string) {
    return usersRepository.listAddresses(BigInt(userId));
  },

  createAddress(
    userId: string,
    data: { label: string; recipient: string; phone: string; fullAddress: string; city: string; postalCode: string; isDefault: boolean },
  ) {
    return usersRepository.createAddress(BigInt(userId), data);
  },

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<{ label: string; recipient: string; phone: string; fullAddress: string; city: string; postalCode: string; isDefault: boolean }>,
  ) {
    await assertOwnsAddress(userId, addressId);
    return usersRepository.updateAddress(BigInt(addressId), data);
  },

  async deleteAddress(userId: string, addressId: string) {
    await assertOwnsAddress(userId, addressId);
    return usersRepository.deleteAddress(BigInt(addressId));
  },

  listCustomers() {
    return usersRepository.listAllCustomers();
  },
};

async function assertOwnsAddress(userId: string, addressId: string) {
  const address = await usersRepository.findAddress(BigInt(addressId));
  if (!address || address.userId.toString() !== userId) {
    throw new AppError(404, "Address not found");
  }
  return address;
}

export const addressOwnership = assertOwnsAddress;
