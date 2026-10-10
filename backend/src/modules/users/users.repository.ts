import { prisma } from "../../lib/prisma";

export const usersRepository = {
  findById(id: bigint) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, skinType: true, createdAt: true },
    });
  },

  updateProfile(id: bigint, data: Partial<{ name: string; skinType: string }>) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, skinType: true },
    });
  },

  listAddresses(userId: bigint) {
    return prisma.address.findMany({ where: { userId }, orderBy: { id: "asc" } });
  },

  findAddress(id: bigint) {
    return prisma.address.findUnique({ where: { id } });
  },

  createAddress(
    userId: bigint,
    data: { label: string; recipient: string; phone: string; fullAddress: string; city: string; postalCode: string; isDefault: boolean },
  ) {
    return prisma.address.create({ data: { ...data, userId } });
  },

  updateAddress(id: bigint, data: Partial<{ label: string; recipient: string; phone: string; fullAddress: string; city: string; postalCode: string; isDefault: boolean }>) {
    return prisma.address.update({ where: { id }, data });
  },

  deleteAddress(id: bigint) {
    return prisma.address.delete({ where: { id } });
  },

  listAllCustomers() {
    return prisma.user.findMany({
      where: { role: "customer" },
      select: { id: true, name: true, email: true, skinType: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },
};
