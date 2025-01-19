export const categories = {
  "house_renting": {
    "heading": "House Renting",
    "template": "rent.txt",
    "questions": [
      {
        "field": "lease_date",
        "question": "What is the date of this lease agreement? (Format: Day Month Year)"
      },
      {
        "field": "landlord_name",
        "question": "What is the name of the Landlord?"
      },
      {
        "field": "tenant_name",
        "question": "What is the name of the Tenant?"
      },
      {
        "field": "property_address",
        "question": "What is the address of the property being rented?"
      },
      {
        "field": "lease_term_start",
        "question": "What is the start date and time of the lease? (Format: Day Month Year, Time)"
      },
      {
        "field": "lease_term_end",
        "question": "What is the end date and time of the lease? (Format: Day Month Year, Time)"
      },
      {
        "field": "monthly_rent",
        "question": "What is the monthly rent for the property? (Currency: ₹)"
      },
      {
        "field": "rent_due_date",
        "question": "On what day of the month is the rent due?"
      },
      {
        "field": "rent_payment_location",
        "question": "Where should the rent be paid? (Address or payment method details)"
      },
      {
        "field": "allow_pets",
        "question": "Are pets allowed on the property? (yes/no)"
      },
      {
        "field": "guest_stay_limit",
        "question": "What is the maximum duration (in days) that a guest can stay without written permission?"
      },
      {
        "field": "tenant_contact_name",
        "question": "What is the Tenant's contact name for notices?"
      },
      {
        "field": "tenant_contact_phone",
        "question": "What is the Tenant's phone number?"
      },
      {
        "field": "tenant_contact_address",
        "question": "What is the Tenant's address for notices after the tenancy ends?"
      },
      {
        "field": "landlord_contact_name",
        "question": "What is the Landlord's contact name for notices?"
      },
      {
        "field": "landlord_contact_address",
        "question": "What is the Landlord's address for notices?"
      },
      {
        "field": "landlord_contact_phone",
        "question": "What is the Landlord's phone number?"
      },
      {
        "field": "key_replacement_fee",
        "question": "What is the cost of replacing locks or keys due to misplacement?"
      },
      {
        "field": "inspection_contact",
        "question": "If the property is unoccupied for 4 or more days, who will inspect the property? (Name and contact details)"
      },
      {
        "field": "agreement_signature_date",
        "question": "What is the date when this lease will be signed by both parties? (Format: Day Month Year)"
      }
    ]
  },
  "loan": {
    "heading": "Loan",
    "template": "loan.txt",
    "questions": [
      {
        "field": "loan_purpose",
        "question": "Are you lending or borrowing money?"
      },
      {
        "field": "loan_reason",
        "question": "What is this loan for? (Business, Debts or Bills, Real Estate, Vehicle, Other)"
      },
      {
        "field": "borrower_location",
        "question": "In which state or union territory do you live?"
      },
      {
        "field": "loan_amount",
        "question": "How much are you lending?"
      },
      {
        "field": "charge_interest",
        "question": "Will you charge interest on the loan?"
      },
      {
        "field": "loan_date",
        "question": "When will you lend the money? (Loan date)"
      },
      {
        "field": "repayment_method",
        "question": "How will the borrower repay the loan? (Regular Payments, A single payment, Other)"
      },
      {
        "field": "payment_frequency",
        "question": "How often will the borrower make payments? (Monthly, Weekly, Yearly)"
      },
      {
        "field": "first_payment_date",
        "question": "When will the borrower make the first payment?"
      },
      {
        "field": "schedule_determination",
        "question": "How do you want to determine the payment schedule? (Specify final payment date, By number of payments)"
      },
      {
        "field": "early_repayment",
        "question": "Can the borrower make lump sum payments or repay the loan early?"
      },
      {
        "field": "overdue_penalty",
        "question": "Will you charge a penalty for overdue payments?"
      },
      {
        "field": "penalty_type",
        "question": "What is the penalty? (Late fee, Interest rate increase)"
      },
      {
        "field": "late_fee_amount",
        "question": "How much is the late fee?"
      },
      {
        "field": "grace_period",
        "question": "Grace Period before late fee is charged? (Days)"
      },
      {
        "field": "lender_type",
        "question": "Who is the lender? (Individual, Company/Organization)"
      },
      {
        "field": "lender_details",
        "question": "Provide the full name or company name and address of the lender."
      },
      {
        "field": "borrower_type",
        "question": "Who is the borrower? (Individual, Company/Organization)"
      },
      {
        "field": "borrower_details",
        "question": "Provide the full name or company name and address of the borrower."
      },
      {
        "field": "cosigner",
        "question": "Is anyone co-signing this loan? (Yes/No)"
      },
      {
        "field": "cosigner_details",
        "question": "Who is co-signing the loan? (Individual or Company/Organization)"
      },
      {
        "field": "collateral",
        "question": "Will the borrower back the loan with an asset or personal property?"
      },
      {
        "field": "collateral_details",
        "question": "What is being used to secure the loan?"
      }
    ]
  }
};
