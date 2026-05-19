"use client";

import { Coffee, QrCode } from "lucide-react";
import Image from "next/image";

export function RewardCard() {
  return (
    <section className="mt-14 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="grid gap-0 md:grid-cols-[1fr_16rem]">
        <div className="flex flex-col justify-center p-6 md:p-8">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-sm font-medium text-secondary">
            <Coffee className="size-4 text-accent" aria-hidden="true" />
            支持写作
          </div>
          <h2 className="text-2xl font-bold leading-tight text-primary">
            如果这篇文章帮你节省了一点时间
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-secondary">
            可以请我喝杯咖啡。你的支持会变成更多源码阅读、工程实践和踩坑记录。
          </p>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.2em] text-secondary/70">
            WeChat Pay
          </p>
        </div>

        <div className="relative border-t border-border bg-[#F7F6F2] p-5 md:border-l md:border-t-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(37,99,235,0.14),transparent_34%),radial-gradient(circle_at_84%_90%,rgba(16,185,129,0.16),transparent_32%)]" />
          <div className="relative rounded-[1.35rem] border border-white/80 bg-white p-3 shadow-[0_18px_45px_rgba(24,24,27,0.14)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <QrCode className="size-3.5" aria-hidden="true" />
                扫码支持
              </span>
              <span className="text-xs text-secondary">谢谢你</span>
            </div>
            <Image
              src="/reward/wechat-pay-qr.jpg"
              alt="微信支付赞赏二维码"
              width={804}
              height={883}
              className="h-auto w-full rounded-2xl border border-emerald-100"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
