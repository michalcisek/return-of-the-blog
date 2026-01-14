---
date: '2026-01-14T13:35:13+01:00'
draft: false
title: 'Is your lottery ticket worth the effort?'
ShowToc: true
ShowReadingTime: true
ShowBreadCrumbs: false
math: true
cover:
  image: "cover2.png"
  #alt: "<alt text>"
  #caption: "Captiooon"
  relative: true # To use relative path for cover image, used in hugo Page-bundles
---

> *I've met people with very different attitudes towards games of chance. I guess it's mostly dependent on individual risk tolerance and various fears of getting addicted. This leads to people drawing different lines about what is acceptable and what makes you an instant gambler (similarly to the case of chemical substances).*
>
> *Most people agree playing Lotto is fine, while others treat it as a tax on stupidity.*
>
> *Some people treat poker as a skill-only game. Some treat it as a one-way ticket to losing a house.*
>
> *Some people paint human head and shoulders shapes on recent Nvidia stock prices and know in which direction it will move next. Others build advanced statistical models incorporating thousands of different pieces of information and believe the same. Some believe it's a staged game, only to profit large institutions and rob individual investors.*
> 
> *You get the picture. Who is right? Where is "the line" splitting what can be played and what is dangerous? I certainly don't know. But I've noticed my perspective on it has changed over time, so in this post I would like to talk loosely about my thoughts on two games of chance that popped up for me last year.*

# Intro

So what's this post about? In 2025 I independently got interested in 2 lottery games.

### OG lottery

First is a classic Lotto game - a national lottery where you pick six numbers from a range, then there is a drawing and you hope the drawn numbers are the same as those picked by you.
Obviously it's not like I first heard about Lotto last year. But till that time I treated it, as mentioned above, as a tax on stupidity. I think I haven't played intentionally even once in my life.
But then I discovered there is an official mobile app for it. You can easily transfer the money, place the bets and enjoy losing your money. And I started to think: "hey, if you don't jump on the carousel of randomness, the prize keeps spinning past your hands" (*Paulo Ciselho, 2026*).
The Lotto ticket is quite cheap, so I figured why not participate on a regular basis, say once a week. That would equal ~150 PLN a year - money that almost certainly needs to be deducted from your account, but with **some** chance of winning. 150 PLN a year to have a chance of winning a few million doesn't sound bad, right?

Of course I don't want to go once a week to a shopping mall or wherever you can buy now Lotto tickets. Nor do I want to remember to place a bet in the app once a week. I love automating different parts of my life, so I also wanted to automate placing bets. And in the official app there is an option to subscribe, so you won't miss any drawing. But it lacked the flexibility I needed for such a serious matter. You can't set your custom frequency - I wanted to play only once a week, but there are three drawings a week. And you can't change the numbers between drawings - you have to stick to the same numbers or trust the provider's random system. I didn't like that. So I tried to prepare a custom script that would emulate entering the app and buying Lotto tickets every week. But it turned out to be a lot of fuss - the app is secured well, and it's a strictly regulated market, so I gave up on the idea.

### New-school lottery

A few months later I saw a short on Instagram about a device for Bitcoin solo mining (*Figure 1*). I'm not very into the crypto topic, but I'm going to describe how it works in more detail later. For now let's simplify it greatly. Bitcoin is supposed to be a digital currency (I repeat: digital currency, not a speculative asset. You are supposed to use it for payments, not for praying the price will bounce back ;)). If you want people to use your currency, you need to create trust around it. "Regular" currencies create trust by being supported by countries and their central banks. Bitcoin does it differently. It uses a network of computers to ensure trust. Part of this network, called "miners", collect recent Bitcoin transactions and, by solving computational puzzles, propose how to write them to the full history of all Bitcoin transactions. All other computers in the network automatically verify if the proposition follows the expected rules. If it does, the miner with the correct solution gets a reward - now it's 3.125 BTC (that's slightly above 1 000 000 PLN as of writing) + transaction fees paid by users.

The catch is that those puzzles I mentioned are really hard to solve, so in reality miners with their massive computers gather in groups to have even more computational power and therefore have more chance to find a solution. If the group finds it, they share the reward - higher chance, but lower payoff. 

Now, the device I mentioned is on the spectrum - it has really poor computational power compared to regular miners and you do it by yourself. So very low chance, but maximum payoff if successful. You are right, that's another lottery. But it's quite different from Lotto in terms of rules. The prize is indeed similar - you become a millionaire. But I didn't mention how often miners need to solve those computational puzzles. It happens every 10 minutes on average. So every 10 minutes you participate in a lottery with a chance of winning the main prize. And you subscribe to it automatically - no need to buy the tickets. 

{{< centered-image src="nmminer_2.png" alt="image" maxWidth="600px" description="Figure 1: Device I bought for Bitcoin solo mining" >}}

### Connecting the dots

At this stage a natural question came to my mind. In which lottery game do you have a higher chance of winning the main prize? And if you were to play those two games over a period of, say, 10 years, which one would earn you more money? Okay, let's be realistic - you obviously lose money in both scenarios in the long term. But for which one should you sign up to minimize lost money and still get this thrilling, delusional feeling about a potential win?

For sure you have some gut feeling about the answers. For Lotto you pay a fixed amount to participate, and that's going to negatively impact our profit and loss account. For solo mining you pay once to participate: you just need the device that costs about 150 PLN (so one year worth of Lotto tickets) + the cost of electricity (power consumption of such devices is low). In terms of winning chances, even if you don't know a thing about cryptocurrencies, you might suspect that the chance of finding a right solution to the puzzles is way lower than picking correctly six numbers out of 49. But on the other hand for solo mining you have a chance every 10 minutes, and for Lotto only once a week.

Our brains aren't naturally good at processing very small probabilities, so for example a 1 in 300 million chance doesn't feel that different from 1 in 30 million. That is probably why lottery operators don't go bankrupt. And that is also why we're going to calculate the chances precisely to have a clear comparison.

# Crunching numbers - Lotto

For Lotto it's rather straightforward to get the numbers. The game has been studied inside out and the math is basically a refresher of combinatorics formulas from high school. To calculate the chance of winning the main prize in a single draw you need to use a binomial coefficient ($\binom{n}{k} = \frac{n!}{k!(n-k)!}$). 

$\binom{49}{6} = 13\ 983\ 816$ - this tells you how many possible 6-numbers draws there are out of 49 numbers. Out of all these possible outcomes only one represents winning set of numbers, so the probability is:

$$
P(Lotto\ jackpot) = \frac{1}{13\ 983\ 816} = 0.000007151\\%
$$

The general formula to calculate the probability of drawing exactly $k$ numbers is: 
$$
P(k) = \frac{\binom{6}{k}\binom{43}{6-k}}{\binom{49}{6}}
$$

For the expected value of a single ticket we have to know the payouts. You win money when you match three, four, five, or six numbers. For three numbers you get a guaranteed 24 PLN. For four numbers you get on average 187.24 PLN (based on the last 100 drawings). For five numbers you get on average 5807.11 PLN (also based on the last 100 drawings). For six numbers, if you are the only person with the right ticket, you win 2,000,000 PLN or more if the last time the lottery took place no one won and it's a rollover. For our purpose let's assume it's 2M PLN. 

To calculate expected value we reuse the formula provided above and the payouts information:

$$
EV = 24\*P(3) + 187.24\*P(4) + 5807.11\*P(5) + 2000000\*P(6) = 0.85\ PLN
$$

Your total expected gross payout is 0.85 PLN, but you pay 3 PLN for the ticket, so that leaves you with net expected value:
$$
NEV(single\ game) = EV - cost = 0.85 - 3 = -2.15\ PLN
$$

You expect to lose 2.15 PLN per play. In other words you could say that on average you get back 28.33% of what you spend ($0.85 / 3$).

Now let's get back to our initial game assumption. I wanted to see what happens if I played Lotto for 10 years, once a week.
That adds up to 520 tickets, so a total cost is 1560 PLN.
Our expected payout is 442 PLN ($0.85*520$ - as events are independent).
So in 10 years our net expected value is:
$$
NEV(in\ 10\ years) = 442 - 1560 = -1118\ PLN
$$


> Three interesting facts: 
> - over 10 years we expect to match three numbers about nine times: $520 * P(3) = 9.18$
> - we have nearly a 40% chance to match four numbers: $1 - (1 - P(4))^{520} = 0.396$ 
> - I'd need to play weekly for ~270 000 years to expect one jackpot


# Crunching numbers - Solo mining

For solo mining we need to first better understand how this mystical "solving puzzles" works. To me it always sounded like some rocket-science task to perform that justifies using so much computing power. And that justifies graphic card price hikes just in time when I needed to buy one back in 2019 (now it's the same with RAM prices thanks to LLMs).

### Hashing - the mining cornerstone

It turns out it's not complicated. The whole process is based on hashing. Hash functions take as input data of any size and return data with fixed size. They have a lot of use cases but are especially popular in cryptography because of one property - they are irreversible, meaning you can't get back to input data from an output. One popular and important hash function for our discussion is called SHA-256 (Secure Hash Algorithm; 256 because it always returns 256 bits as output; or 64 in hexadecimal). Below are a few examples of how this function works:

```python
SHA256('short input') = 
9a200a1b21abbd44409feb953026612cefe3f31bd35ff1c4b7b45ede7ce4f76f
SHA256('short inputs') = 
61ca78ec5b9849ad28dbf593dd9edcd780ea67c4cd936eb3f6721d7b80694fa8
SHA256('and this is longer input') = 
e175aea5ffc33e3458472cc5dc42a8a906d1deecd09eea65f123f84f77f1d046
```

Two desired properties are shown here. First, that in all cases the output length is the same. And second, that even a small change in input leads to a completely different output.

### Understanding the mining process

Now back to our Bitcoin use case. As mentioned before, miners try to add a new block of Bitcoin transactions to the blockchain (transaction history). How do they actually do it? 
They construct a new block header, which contains metadata about the block and a summary of its transactions. Such a header contains:
- version (signals which rules should be used for validation)
- hash of previous block
- Merkle root (a hash summarizing all transactions in the block)
- timestamp
- difficulty target (compact representation of the target value)   
- **nonce**

Nonce is the key here, as it is the main thing miners repeatedly change during the process. 
The goal is to hash the entire block header so that it has the desired properties.
What are those desired properties defined by the difficulty target? 
Basically those requirements specify how small the hash must be. This is often explained as the hash needing to have a certain number of leading zeros (for example,
`000000a5ffc33e3458472cc5dc42a8a906d1deecd09eea65f123f84f77f1d046` has six leading zeros).
Technically, the rule is that the hash must be numerically lower than a target value, but using leading zeros is a convenient simplification.

There are many quirks to this process, but for further discussion this representation of mining is enough:
1. change the nonce value in the block header
2. take the entire block header and apply the SHA-256 function to it to get a hash
3. apply SHA-256 again on the hash from previous step
4. check if the hash meets the requirements (has enough leading zeros)
5. repeat the process until you get a proper hash or until someone else does it

### Getting it all together

Let's start with the probability of winning "the main prize", that is finding a single block worth 3.125 BTC.
Based on the mechanics of Bitcoin mining, it's intuitive that the more hashes you can check, the higher the chance of finding one.
This measure is called hashrate - it tells you how many hashes you can check per second.
The device that I bought has a hashrate of 1000 KH/s. It means that it can check 1 million hashes per second.
It sounds nice, but we need to compare it to the network hashrate, i.e. the hashrate of all miners/devices that try to find a block.
For recent months it's about 1 ZH/s (zettahashes). Zetta prefix means $10^{21}$. So our probability is:

$$
P(single\ block) = \frac{Your\ device\ hashrate}{Network\ hashrate} = \frac{10^6}{10^{21}} = 10^{-15} = 0.0000000000001\\%
$$


For the expected value of a single block we multiply this probability by the reward and deduct the costs of electricity (we can neglect the cost of purchasing the device at this stage).
Reward is 3.125 BTC (let's skip transaction fees that would increase it). That is 1 030 000 PLN as of today.
1 kWh costs about 1 PLN. That's 0.00017 PLN for the average time of finding a single block (10 minutes).

$$
NEV(single\ block) = (0.0000000000001\\% * 1\ 030\ 000\ PLN) - 0.00017\ PLN = \newline
= -0.00016999897\ PLN
$$

So basically the net expected value for a single block is the cost of electricity needed to power the device.

What about a 10-year horizon as assumed initially?
Over 10 years there will be 525 960 blocks. That gives us expected $5.26*10^{-10}$ blocks (0.000000000526).
The prize for finding a block changes roughly every four years. To be precise, it decreases by half (this event is called Bitcoin Halving). The last halving was in 2024, so we can assume the prize will be 3.125 until 2028, then it will decrease to 1.5625 and in 2032 to 0.78125. So for the next 10 years we can assume the prize will be 1.5625 (using a weighted average).

As for the costs we have to include here both electricity and device cost. The former would be 87.6 PLN and the latter 150 PLN. Spoiler alert: the expected payout is still close to zero, so we will again see only the costs part in the expected payout calculations:

$$
NEV(in\ 10\ years) = 5.26*10^{-10} * 1.5625 * 330000 - (87.6+150) = \newline
= -237.5997\ PLN
$$

And the assumptions I made here are on the optimistic side, I'd say, because I assume fixed electricity cost, fixed Bitcoin price, and fixed network hashrate. Not to mention that based on my experience this device is not the most stable one - it often loses connection to the network and therefore doesn't participate continuously in the mining process.

> Three interesting facts:
> - for our device the expected time to find one block is ~19 billion years (that's longer than the age of the universe!)
> - our device would need to hash 800000x faster, keeping the same costs, to break even in a 10-year period
> - you can try bitcoin mining by hand. [Someone did it](https://www.righto.com/2014/09/mining-bitcoin-with-pencil-and-paper.html?m=0) and it translated to computing power of 0.67 hashes **per day**

# Summary

So there we have it. Now the chances in these two games are quantified and the verdict is clear.
Not surprisingly, in both cases it's extremely unlikely to win, even in a 10-year period.
Numerically speaking, you have higher chance to win the Lotto jackpot, but if you wish to minimise the lost money, solo mining should be considered.
To sum up this article, let's think of other factors that encourage people towards lottery games.

For Lotto I guess it's the phenomenon of "near misses" that keeps people engaged. Getting four out of six numbers triggers similar brain responses to actual wins. And this creates the illusion that you're getting closer, forgetting that each attempt is independent.
This occasional small reward structure is particularly powerful. Variable, unpredictable rewards are more compelling to human brains than consistent ones. This is the same mechanism that makes social media scrolling so engaging. You never know what interesting might pop up next, which maintains interest and anticipation.
And for sure an element of personal superstition plays a role, like your lucky numbers or some kind of rituals (I remember my father asking me to pick one number on his coupon). 

For solo mining I guess there are some people driven by ideological reasons, who do so to participate in network security and to preserve decentralization. C'mon, they do it because of greed (insert Gordon Gekko picture). Unless you have a large Bitcoin miner, it's basically Lotto on steroids.
The upside is the low cost of participation, both from a device and power consumption perspective. This creates a psychological appeal of hope and possibility - it's easy to justify it as "buying a dream" for a few bucks.
And let's not forget about availability bias, that is overestimating the likelihood of things we can easily recall. Lottery wins get significant media attention, making them memorable, like [this recent example](https://forklog.com/en/solo-miner-strikes-bitcoin-block-earns-264558/) of solo miner finding a block.

Do I plan to pursue playing one of these games? Nah. I feel like writing about it and calculating probabilities cured myself from trying. 

But maybe I'm just one lottery ticket away from winning...?
