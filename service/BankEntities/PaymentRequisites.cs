﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BankEntities
{
	public class PaymentRequisites
	{
		public int AccountId { get; set; }

		public decimal Amount { get; set; }

		public EripPaymentType Type { get; set; }

		public string JsonPayment { get; set; }

		public string ChangeId { get; set; }
	}
}