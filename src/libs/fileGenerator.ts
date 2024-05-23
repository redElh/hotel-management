import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { Booking } from "@/models/booking";
import { User } from "@/models/user"; // Assuming you have a User model

export async function generateBookingFile(booking: Booking, user: User): Promise<string> {
  const directoryPath = path.join(__dirname, 'tmp'); // Ensure you have a valid directory
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const fileName = `booking-confirmation-${booking._id}.txt`;
  const filePath = path.join(directoryPath, fileName);

  const fileContent = `
    Booking Confirmation
    --------------------
    User Name: ${user.name}
    User Email: ${user.email}

    Booking ID: ${booking._id}
    Room: ${booking.hotelRoom.name}
    Check-in Date: ${booking.checkinDate}
    Check-out Date: ${booking.checkoutDate}
    Adults: ${booking.adults}
    Children: ${booking.children}
    Number of Days: ${booking.numberOfDays}
    Discount: ${booking.discount}%
    Total Price: $${booking.totalPrice}
  `;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        reject(err);
      } else {
        // Définir le fichier en lecture seule
        fs.chmod(filePath, 0o444, (err) => {
          if (err) {
            console.log("kkkk");
            reject(err);
          } else {
            console.log("nice");
            
            resolve(filePath);
          }
        });
      }
    });
  });
}
