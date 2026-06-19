"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateBookingReference } from "@/lib/booking-data";
import { INITIAL_BOOKING_STATE, type BookingStep } from "@/components/booking/types";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { DateTimeStep } from "@/components/booking/DateTimeStep";
import { DetailsStep } from "@/components/booking/DetailsStep";
import { PaymentStep } from "@/components/booking/PaymentStep";
import { ConfirmationStep } from "@/components/booking/ConfirmationStep";

const STEP_ORDER: BookingStep[] = ["services", "datetime", "details", "payment", "confirmation"];

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<BookingStep>("services");
  const [booking, setBooking] = useState(INITIAL_BOOKING_STATE);

  function goTo(target: BookingStep) {
    setStep(target);
  }

  function goBack() {
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) setStep(STEP_ORDER[index - 1]);
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-white">
      <section className="flex w-full max-w-md flex-1 flex-col">
        {step === "services" && (
          <ServiceStep
            selected={booking.service}
            onSelect={(service) => setBooking((b) => ({ ...b, service }))}
            onNext={() => goTo("datetime")}
          />
        )}

        {step === "datetime" && (
          <DateTimeStep
            date={booking.date}
            time={booking.time}
            onSelectDate={(date) => setBooking((b) => ({ ...b, date }))}
            onSelectTime={(time) => setBooking((b) => ({ ...b, time }))}
            onBack={goBack}
            onNext={() => goTo("details")}
          />
        )}

        {step === "details" && (
          <DetailsStep
            name={booking.clientName}
            phone={booking.clientPhone}
            onChangeName={(clientName) => setBooking((b) => ({ ...b, clientName }))}
            onChangePhone={(clientPhone) => setBooking((b) => ({ ...b, clientPhone }))}
            onBack={goBack}
            onNext={() => goTo("payment")}
          />
        )}

        {step === "payment" && (
          <PaymentStep
            service={booking.service}
            paymentMethod={booking.paymentMethod}
            proofFileName={booking.proofFileName}
            onSelectMethod={(paymentMethod) => setBooking((b) => ({ ...b, paymentMethod }))}
            onUploadProof={(proofFileName) => setBooking((b) => ({ ...b, proofFileName }))}
            onBack={goBack}
            onNext={() => {
              setBooking((b) => ({ ...b, reference: generateBookingReference() }));
              goTo("confirmation");
            }}
          />
        )}

        {step === "confirmation" && (
          <ConfirmationStep booking={booking} onDone={() => router.push("/")} />
        )}
      </section>
    </main>
  );
}
