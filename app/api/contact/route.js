import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const dataFilePath = path.join(process.cwd(), 'data/messages.json');

// POST /api/contact - Submit new message
export async function POST(request) {
    try {
        const body = await request.json();

        // Validation
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: 'Ad, e-posta ve mesaj alanları zorunludur.' },
                { status: 400 }
            );
        }

        // Read existing data
        let messages = [];
        try {
            const fileContent = await fs.readFile(dataFilePath, 'utf-8');
            messages = JSON.parse(fileContent);
        } catch (error) {
            // File might not exist yet, which is fine
        }

        // Add new message
        const newMessage = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString(),
            read: false
        };

        messages.unshift(newMessage); // Add to beginning

        // Save file
        await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2));

        // Send Email Notification
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: 'kaankociletisim@gmail.com', // User's email
                    subject: `Yeni İletişim Formu Mesajı: ${body.name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #003a70;">Yeni Mesaj Var! 📩</h2>
                            <p><strong>Gönderen:</strong> ${body.name}</p>
                            <p><strong>E-posta:</strong> ${body.email}</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                                <p><strong>Mesaj:</strong></p>
                                <p>${body.message}</p>
                            </div>
                            <p style="font-size: 12px; color: #777; margin-top: 30px;">Bu mesaj websitesi iletişim formundan gönderilmiştir.</p>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail the request if email fails, just log it
            }
        }

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json(
            { error: 'Mesaj kaydedilirken bir hata oluştu.' },
            { status: 500 }
        );
    }
}
