import * as z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Numele trebuie să conțină cel puțin 2 caractere.",
  }),
  email: z.string().email({
    message: "Vă rugăm să introduceți o adresă de email validă.",
  }),
  phone: z.string().min(10, {
    message: "Numărul de telefon trebuie să conțină cel puțin 10 caractere.",
  }),
  address: z.string().min(5, {
    message: "Adresa trebuie să conțină cel puțin 5 caractere.",
  }),
  city: z.string().min(2, {
    message: "Orașul trebuie să conțină cel puțin 2 caractere.",
  }),
  state: z.string().min(2, {
    message: "Județul trebuie să conțină cel puțin 2 caractere.",
  }),
  zipCode: z.string().min(4, {
    message: "Codul poștal trebuie să conțină cel puțin 4 caractere.",
  }),
  country: z.string().min(2, {
    message: "Țara trebuie să conțină cel puțin 2 caractere.",
  }),
  serviceType: z.enum(["standard", "medium", "priority"], {
    required_error: "Vă rugăm să selectați un tip de serviciu.",
  }),
  shippingMethod: z.enum(["standard", "express"], {
    required_error: "Vă rugăm să selectați o metodă de livrare.",
  }),
  cards: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Numele cărții este obligatoriu"),
      year: z.string().min(4, "Anul trebuie să conțină 4 cifre"),
      set: z.string().min(1, "Setul este obligatoriu"),
      cardNumber: z.string().optional(),
      variant: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
});