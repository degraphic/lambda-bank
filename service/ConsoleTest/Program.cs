﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Win32;
using BankEntities;
using System.Data.Entity;
using System.Threading;
namespace ConsoleTest
{
	class Program
	{
		static void Main(string[] args)
		{
			/*System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
			message.To.Add("sergehill@gmail.com");
			message.Subject = "This is the Subject line";
			message.From = new System.Net.Mail.MailAddress("thereisnohuman@drs-cd.com", "Lambda Bank Robo");
			message.Body = "This is the message body";
			System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587);
			smtp.UseDefaultCredentials = false;
			smtp.Credentials = new System.Net.NetworkCredential("thereisnohuman@drs-cd.com", "thereisnospoon");
			//smtp.Credentials = new System.Net.NetworkCredential("thereisnohuman@drs-cd.com", "111111");
			//smtp.Credentials = new System.Net.NetworkCredential("ivan_borushko_gmail", "dcGfccrjlt");
			
			smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
			
			smtp.EnableSsl = true;
			smtp.Send(message);*/

			Console.WriteLine(string.Format("{0:000}", 1));

			Console.ReadKey();
		}

		static void print(object state)
		{
			Console.WriteLine("111");
		}
	}
}
