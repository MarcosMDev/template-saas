import { NextResponse, type NextRequest } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function POST(req: NextRequest) {
  const { testId, userEmail } = await req.json();

  try {
    const preference = new Preference(mpClient);

    const createPreference = await preference.create({
      body: {
        external_reference: testId,
        metadata: {
          testId,
        },
        ...(userEmail && { payer: { email: userEmail } }),
        items: [
          {
            id: "",
            description: "",
            title: "",
            quantity: 1,
            unit_price: 1,
            currency_id: "BRL",
            category_id: "services",
          },
        ],
        payment_methods: {
          installments: 12,
          // excluded_payment_methods: [
          //   {
          //     id: "bolbradesco",
          //   },
          //   {
          //     id: "pec",
          //   },
          // ],
          // excluded_payment_types: [
          //   {
          //     id: "debit_card",
          //   },
          //   {
          //     id: "credit_card",
          //   },
          // ],
        },
        auto_return: "approved",
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/pending`,
        },
      },
    });

    if (!createPreference.id) {
      return NextResponse.json(
        {
          error: "Error creating Mercado Pago preference",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      preferenceId: createPreference.id,
      initPoint: createPreference.init_point,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Error creating Mercado Pago preference: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
