"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitBooking } from "./actions";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmitBooking() {
    if (!booking.service || !booking.date || !booking.time || !booking.paymentMethod || !booking.proofImageUrl) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitBooking({
      service: booking.service,
      date: booking.date,
      time: booking.time,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      paymentMethod: booking.paymentMethod,
      proofImageUrl: booking.proofImageUrl,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setBooking((b) => ({ ...b, reference: result.reference }));
    goTo("confirmation");
  }

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
            proofImageUrl={booking.proofImageUrl}
            error={submitError}
            isSubmitting={isSubmitting}
            onSelectMethod={(paymentMethod) => {
              setSubmitError(null);
              setBooking((b) => ({ ...b, paymentMethod }));
            }}
            onUploadProof={(proofImageUrl) => setBooking((b) => ({ ...b, proofImageUrl }))}
            onBack={goBack}
            onPickDifferentTime={() => {
              setSubmitError(null);
              goTo("datetime");
            }}
            onNext={handleSubmitBooking}
          />
        )}

        {step === "confirmation" && (
          <ConfirmationStep booking={booking} onDone={() => router.push("/")} />
        )}
      </section>
    </main>
  );
}
