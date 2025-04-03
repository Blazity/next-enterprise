import { ArrowRight, Construction, MessageCircle, Send, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function UnderDevelopment() {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-2xl">
        <div className="flex justify-center pt-8">
          <Image
            src="/social-icon-with-horizontal-text-horizontal.svg"
            alt="Chat Guide Logo"
            width={320}
            height={100}
            priority
            className="mb-2"
          />
        </div>

        <CardHeader className="space-y-2 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-7 w-7 text-pink-500" />
              <CardTitle className="text-3xl">Chat Guide Coming Soon</CardTitle>
            </div>
            <Badge variant="outline" className="border-pink-200 bg-pink-100/50 px-4 py-1 text-base text-pink-500">
              Soon
            </Badge>
          </div>
          <CardDescription className="mt-2 text-lg">
            I'm creating a blog to share my chat techniques, tips, and personal experiences from OnlyFans
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="px-8 pt-8 pb-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Share2 className="text-muted-foreground mt-0.5 h-6 w-6" />
              <div>
                <p className="text-lg font-medium">My blog is almost ready!</p>
                <p className="text-muted-foreground mt-2">
                  I'm putting together my best chat strategies, engagement tips, and stories from my personal experience
                  to help other creators connect better with their fans.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6 text-base">
              <p className="mb-3 text-lg font-semibold">What I'll be sharing:</p>
              <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                <li>Chat techniques that increase engagement</li>
                <li>How to build genuine connections</li>
                <li>Tips for managing conversations</li>
                <li>Real examples from my experience</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between px-8 pb-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="mailto:contact@subscribers.chat">Email me</Link>
          </Button>
          <Button size="lg" asChild className="bg-[#0088cc] hover:bg-[#0077b5]">
            <Link href="https://t.me/onated2" target="_blank" rel="noopener noreferrer">
              <Send className="mr-2 h-5 w-5" />
              Telegram
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
