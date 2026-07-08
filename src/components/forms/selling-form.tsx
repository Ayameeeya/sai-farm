"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { LetterSwapSubmitButton } from "@/components/ui/letter-swap-button"
import citiesData from "@/components/forms/json/cities/shizuoka.json"

type FormData = {
  kind: string
  prefecture: string
  city: string
  address: string
  isLiving: string
  name: string
  email: string
  tel: string
}

const FORMSPREE_URL = "https://formspree.io/f/mzbkvjwn"
const cityOptions = citiesData.cities

function RequiredTag() {
  return (
    <span className="ml-2.5 inline-block text-[10px] tracking-[0.1em] text-red-400">
      必須
    </span>
  )
}

function OptionalTag() {
  return (
    <span className="ml-2.5 inline-block text-[10px] tracking-[0.1em] text-black/35">
      任意
    </span>
  )
}

const LABEL = "block text-[12px] tracking-[0.14em] text-black/50"
const INPUT =
  "mt-2.5 w-full border-b border-black/20 bg-transparent pb-2.5 text-[14px] text-black outline-none transition-colors duration-300 placeholder:text-black/25 focus:border-black"
const RADIO_LABEL =
  "flex cursor-pointer items-center gap-2.5 text-[13px] text-black/70 transition-colors hover:text-black"
const SECTION_HEAD = (
  num: string,
  title: string,
) => (
  <div className="lg:col-span-4">
    <p
      className="text-[12px] tracking-[0.25em] text-black/35 tabular-nums"
      style={{ fontFamily: "var(--font-barlow)" }}
    >
      {num}
    </p>
    <h3 className="mt-2 font-serif text-[18px] font-light text-black/85 lg:text-[20px]">
      {title}
    </h3>
  </div>
)

export function SellingForm() {
  const router = useRouter()
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      kind: "一戸建て",
      prefecture: "静岡県",
      isLiving: "空家（空地）",
      city: cityOptions[0]?.key ?? "",
    },
  })

  useEffect(() => {
    setValue("prefecture", "静岡県")
    setValue("isLiving", "空家（空地）")
    setValue("kind", "一戸建て")
    if (cityOptions[0]) setValue("city", cityOptions[0].key)
  }, [setValue])

  const onSubmit = async (data: FormData) => {
    const cityName = cityOptions.find((c) => c.key === data.city)?.name ?? data.city
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, city: cityName, formType: "sales" }),
      })
      const json = await res.json()
      if (json.ok) router.push("/thanks/")
    } catch {
      /* noop */
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* お客様情報 */}
        <div className="grid grid-cols-1 gap-8 border-t border-black/10 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          {SECTION_HEAD("01", "お客様情報")}
          <div className="space-y-8 lg:col-span-7 lg:col-start-6">
            <div>
              <label htmlFor="name" className={LABEL}>
                氏名 <RequiredTag />
              </label>
              <input
                id="name"
                placeholder="例）伊豆太郎"
                className={INPUT}
                {...register("name", { required: "氏名を入力してください" })}
              />
              {errors.name && <p className="mt-1.5 text-[12px] text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="tel" className={LABEL}>
                  電話番号 <RequiredTag />
                </label>
                <input
                  id="tel"
                  placeholder="例）09012345678"
                  className={INPUT}
                  {...register("tel", { required: "電話番号を入力してください" })}
                />
                {errors.tel && <p className="mt-1.5 text-[12px] text-red-500">{errors.tel.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className={LABEL}>
                  メールアドレス <RequiredTag />
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="例）saifarm@example.com"
                  className={INPUT}
                  {...register("email", {
                    required: "メールアドレスを入力してください",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "不正なメールフォーマットです",
                    },
                  })}
                />
                {errors.email && <p className="mt-1.5 text-[12px] text-red-500">{errors.email.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* 不動産の種類 */}
        <div className="grid grid-cols-1 gap-8 border-t border-black/10 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          {SECTION_HEAD("02", "不動産の種類")}
          <div className="lg:col-span-7 lg:col-start-6">
            <Controller
              control={control}
              name="kind"
              rules={{ required: "物件の種類を選択してください" }}
              render={({ field }) => (
                <div className="flex flex-wrap gap-x-10 gap-y-4">
                  {["一戸建て", "土地", "その他"].map((opt) => (
                    <label key={opt} className={RADIO_LABEL}>
                      <input
                        type="radio"
                        {...field}
                        value={opt}
                        checked={field.value === opt}
                        className="accent-black"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.kind && <p className="mt-4 text-[12px] text-red-500">{errors.kind.message}</p>}
          </div>
        </div>

        {/* 不動産の所在地 */}
        <div className="grid grid-cols-1 gap-8 border-t border-black/10 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          {SECTION_HEAD("03", "不動産の所在地")}
          <div className="space-y-8 lg:col-span-7 lg:col-start-6">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="prefecture" className={LABEL}>
                  都道府県
                </label>
                <input
                  id="prefecture"
                  readOnly
                  className={`${INPUT} text-black/45`}
                  {...register("prefecture", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="city" className={LABEL}>
                  市区町村 <RequiredTag />
                </label>
                <select
                  id="city"
                  className={`${INPUT} cursor-pointer`}
                  {...register("city", { required: "市区町村を選択してください" })}
                >
                  {cityOptions.map((city) => (
                    <option key={city.key} value={city.key}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="mt-1.5 text-[12px] text-red-500">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="address" className={LABEL}>
                住所 <RequiredTag />
              </label>
              <textarea
                id="address"
                rows={2}
                placeholder="例）〇〇町 1-1-1"
                className={`${INPUT} resize-none`}
                {...register("address", { required: "住所を入力してください" })}
              />
              {errors.address && <p className="mt-1.5 text-[12px] text-red-500">{errors.address.message}</p>}
            </div>
            <div>
              <p className={LABEL}>現在の状況</p>
              <Controller
                control={control}
                name="isLiving"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="mt-3.5 flex flex-wrap gap-x-10 gap-y-4">
                    {["居住中", "空家（空地）"].map((opt) => (
                      <label key={opt} className={RADIO_LABEL}>
                        <input
                          type="radio"
                          {...field}
                          value={opt}
                          checked={field.value === opt}
                          className="accent-black"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-10 lg:pt-14">
          <LetterSwapSubmitButton
            label="送信する"
            isSubmitting={isSubmitting}
            className="w-full px-10 py-3.5 tracking-[0.15em] sm:w-auto"
          />
        </div>
      </form>
    </div>
  )
}
