import { PrismaClient, User, Customer, Invoice } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";
import { E_INVOICE_STATUS } from "../src/types/models";
import { auth } from "../src/services/firebase";
import { firebaseSignUp } from "../src/services/auth/auth";
import { UserRecord } from "firebase-admin/auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.invoice.deleteMany({});
  await prisma.customer.deleteMany({});

  firebaseRemoveAllUsers();
  await prisma.user.deleteMany({});

  // sets locale to en_US
  faker.locale = "en_US";

  const genders = ["female", "male"] as ("female" | "male")[];
  const users: any[] = []; // users array
  const customers: any[] = []; // array of customers
  const invoices: any[] = []; // array of Invoices

  const invoiceStatus = ["SENT", "PAID", "CANCELLED"]; // status of invoice

  // ============ Users loop ============
  const nbUser = 10; // number of Users

  const Roles: Array<"USER" | "ADMIN" | "INVOICER"> = ["ADMIN", "INVOICER"]; // users roles
  for (let u = 0; u < nbUser; u++) {
    let chrono = 1;
    const userGender = faker.helpers.arrayElement<"female" | "male">(genders);
    const userRoles: Array<"USER" | "ADMIN" | "INVOICER"> = [];
    userRoles.push(faker.helpers.arrayElement(Roles));
    userRoles.push("USER");

    // const hash = await bcrypt.hash("password", 10);

    const firstName_ = faker.name.firstName(userGender);
    const lastName_ = faker.name.lastName(userGender);
    const email = faker.internet.email(firstName_, lastName_);

    const userRecord = await firebaseSignUp(email, "password");
    if (userRecord) {
      const user: any = {
        // id: userRecord.uid,
        uid: userRecord.uid,
        // email: faker.internet.email(firstName_, lastName_),
        // email: userRecord.email,
        firstName: firstName_,
        lastName: lastName_,
        // password: hash,
        roles: userRoles,
      };

      const user_ = await prisma.user.create({
        data: {
          ...user,
        },
        include: {
          customers: {
            include: {
              invoices: true,
            },
          },
        },
      });

      // ============ Customers loop ============
      const nbCustomer: number = faker.datatype.number({ min: 5, max: 20 }); // random number of customers for the current user

      for (let c = 0; c < nbCustomer; c++) {
        const customerGender = faker.helpers.arrayElement<"female" | "male">(
          genders
        );
        const firstName = faker.name.firstName(customerGender);
        const lastName = faker.name.lastName(customerGender);

        const customer: any = {
          email: faker.internet.email(firstName, lastName),
          firstName,
          lastName,
          company: faker.company.name(),
        };

        const customer_ = await prisma.customer.create({
          data: {
            ...customer,
            userId: user_.id,
          },
        });

        // ============ Invoices loop ============
        const nbInvoice: number = faker.datatype.number({ min: 3, max: 20 }); // random number of Invoices for the current customer

        for (let c = 0; c < nbInvoice; c++) {
          const invoice: any = {
            amount: parseFloat(faker.finance.amount(250, 5000)),
            status:
              E_INVOICE_STATUS[
                faker.helpers.arrayElement(
                  invoiceStatus
                ) as keyof typeof E_INVOICE_STATUS
              ],
            // status: E_INVOICE_STATUS[faker.helpers.arrayElement(invoiceStatus)],
            chrono,
            sentAt: faker.date.between(
              "2022-01-01T00:00:00",
              "2022-08-01T00:00:00"
            ),
            // sentAt: moment(faker.date.between('2022-01-01T00:00:00.000Z', '2022-08-01T00:00:00.000Z')).format("YYYY-MM-DD hh:mm:ss")
          };

          chrono++; // increment the user's invoice chrono

          const invoice_ = await prisma.invoice.create({
            data: {
              ...invoice,
              customerId: customer_.id,
            },
          });
          // Add the current invoice to the array of invoices
          invoices.push(invoice_);
        }

        // const user_ = await prisma.user.create({
        //             data: {
        //                 ...user,
        //                 customers: {
        //                     create: {
        //                         ...customer,
        //                         invoices: {
        //                             create: [...invoices]
        //                         }
        //                     },
        //                 }
        //             },
        //             include: {
        //                 customers: {
        //                     include: {
        //                         invoices: true
        //                     }
        //                 }
        //             }
        //         })

        // Add the current customer to the array of customers
        customers.push(customer);
      }
      // Add the current user to the array of users
      users.push(user_);
    }
  }

  console.log("=================== Invoices ===================");
  console.table(invoices);
  console.log("=================== Customers ===================");
  console.table(customers);
  console.log("=================== Users ===================");
  console.table(users);
}

const firebaseRemoveAllUsers = async () => {
  try {
    const usersList = await auth.listUsers();
    const users = usersList.users.map((user) => user.uid);

    const deleteUsersResult = await auth.deleteUsers(users);
    console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
    console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
    deleteUsersResult.errors.forEach((err) => {
      console.log(err.error.toJSON());
    });
  } catch (error) {
    console.log(
      "=================== firebase Remove All Users Error ==================="
    );
    console.log(error);
  }
};

main()
  .then(() => console.log("Fixtures data script sucessfully executed"))
  .catch((e) => {
    console.log(e);
  });
