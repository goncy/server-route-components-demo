"use client";

import type {Ad, Network} from "@/types";

import {Suspense, useState} from "react";

import Lazy from "@/components/lazy";
import {SocialAd} from "@/components/social-ad";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";

export default function HomePage() {
  const [ad, setAd] = useState<Ad>({
    account: "goncy",
    content:
      "Hello demo days!. This is some example content, if you are reading this say hi in the chat!",
  });
  const [network, setNetwork] = useState<Network>("facebook");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setAd({
      account: formData.get("account") as string,
      content: formData.get("content") as string,
    });

    setNetwork(formData.get("network") as Network);
  }

  return (
    <section className="grid grid-cols-2 gap-4">
      <aside>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Label className="grid gap-2">
            Network
            <Select defaultValue={network} name="network">
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
            </Select>
          </Label>
          <Label className="grid gap-2">
            Account
            <Input defaultValue={ad.account} name="account" placeholder="account" type="text" />
          </Label>
          <Label className="grid gap-2">
            Content
            <Textarea defaultValue={ad.content} name="content" placeholder="content" />
          </Label>
          <Button type="submit">Preview</Button>
        </form>
      </aside>
      <article>
        <Suspense fallback={<Skeleton className="h-[187.99px] w-[512px] rounded-lg" />}>
          <Lazy ad={ad} as={SocialAd} network={network} />
        </Suspense>
      </article>
    </section>
  );
}
