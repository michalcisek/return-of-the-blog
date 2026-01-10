---
date: '2026-01-07T19:35:13+01:00'
draft: true
title: 'Is your lottery ticket worth the effort?'
ShowToc: false
ShowReadingTime: true
ShowBreadCrumbs: false
math: true
cover:
  image: "cover2.png"
  #alt: "<alt text>"
  #caption: "Captiooon"
  relative: true # To use relative path for cover image, used in hugo Page-bundles
---

*I've met people with very different attitude towards games of chance. I guess its mostly dependent on individual risk tolerance and various fear of getting addicted. This leads to people drawing different lines on what is acceptable and on what makes you an instant gambler (similarly as in the case of chemical substances).*\
*Most people agree playing lotto is fine. While the others treat it as a tax on stupidity.*\
*Some people treat poker as a skill-only game. Some people treat it as a one-way ticket to losing your house.*\
*Some people bet against Manchester United winning 5 games in a row. While others treat betting as a waste of time as bookmakers won't let you win in a long term.*\
*Some people paint human head and shoulders shapes on recent Nvidia stock prices and know in which direction it will move next. The others build advanced statistical models incorporating thousands of different information and believe the same. Some others believe it's a staged game, only to profit large institutions and ?milk down? individual players.*\
*You get the picture. Who is right? Where is "the line" splitting what can be played and what is dangerous? I certainly don't know. But I've noticed my perspective for it has changed over time so in this post I would like to talk loosely about my thoughts on 2 games of chance that popped to me last year.*

### Disclaimer

Let's start with a disclaimer. I have a rather liberal attitude towards broadly speaking lotteries. I don't mind betting some popular football games, or playing a roulette/blackjack. Actually I think going to casino with your friends is a really cool entertainment, as long as you don't treat it as potential income source and keep your expenses under control.
But let's make it clear - I don't encourage anyone to play any games of chance. And I hope my opinions don't sound as a justification to do so. Things can get out of control easily and indeed it can end up with life-devastating addiction.

# Intro

So what's this post about? In 2025 I independently got hands on 2 games of chance.

First is a classic Lotto game - national lottery where you pick 6 numbers from some range, then there is a drawing and you hope the drawn numbers are the same as those picked by you.
Obviously it's not like I first heard about Lotto last year. But till that time I treated it, as mentioned above, as a tax on stupidity. And I think I didn't play intentionally even once in my life.
But then I discovered there is official app for it. You can easily transfer the money, place the bets and enjoy losing your money. And I started to think: "hey, if you don't jump on the carousel of randomness, the prize keeps spinning past your hands" (*Paulo Ciselho, 2026*).
Lotto ticket is quite cheap, so I figured why don't participate on a regular basis, say once a week. That would equal to ~150 PLN a year - money that almost certainly needs to be deducted from your account, but with **some** chance of winning. 150 PLN a year to have a chance of winning few millions doesn't sound bad, right?

Of course I don't want to go once a week to a shopping mall or wherever you can buy now lotto tickets. I love automating different parts of my life, so I also wanted to automate placing bets. And actually in the official app there is an option to subscribe, so you won't miss any drawing. But it lacked flexibility I needed for such serious matter. You can't set your custom frequency - I wanted to play only once a week, but there are 3 drawings a week. And you can't change the numbers between drawings - you have to stick to the same numbers or trust in random system of the provider. I didn't like that. So I tried to prepare a custom script that would emulate entering the app and buying lotto tickets. But it turned out it's not that easy - the app is secured well and it's a regulated market so I gave up on the idea.


A few months later I've seen some short on Instagram about device for Bitcoin solo mining. I'm not very into the crypto topic, but I'm going to explain how it works exactly later. For now let's simplify it greatly. Bitcoin is supposed to be digital currency (I repeat: digital currency, not speculative asset. You are supposed to use it for payments, not for praying the price will bounce back ;)). If you want people to use your currency, you need to create trust around it. "Regular" currencies create trust by being supported by countries and their central banks. Bitcoin does it differently. It uses a network of computers to ensure trust. Part of this network, called "Miners", collect recent Bitcoin transactions and by solving computational puzzles, propose how to write them to the full history of all Bitcoin transactions. All other computers in the network automatically verify if the proposition follows the rules. If it does, the miner with correct solution gets a reward - now it's 3.125 BTC (that's slightly above 1 000 000 PLN as of writing) + transaction fees paid by users.

The catch is that those puzzles I mentioned are really hard to solve, so in reality Miners with their big-ass computers gather in groups to have even more computational power and therefore have more chance to find a solution. If the group find it, they share the reward - higher chance, but lower payoff. 

Now, the device I mentioned in on the spectrum - it has really poor computational power compared to regular Miners and you do it by yourself. So low chance, but maximum payoff if succeeded. So yes, another lottery. But lottery quite different to Lotto in terms of rules. The prize is indeed similar - you become a millionaire. But I didn't mention how often miners need to solve those computational puzzles. It happen to be every 10 minutes on average. So every 10 minutes you participate in a lottery with a chance of winning the main prize. And you do so automatically. 

I hope the same question came to your mind as it did to mine after getting to know about this device. In which lottery game you have a higher chance of winning the main prize? And if you were to play those two games in a period of say 10 years, which one would earn you more money? Okay, let's be realistic - you obviously lose money in both scenarios in the long-term. But for which one you should sign up to minimise lost money and still get this thrilling, delusional feeling about potential win?

For sure you have some gut feeling about answers. For lotto you pay a constant amount to participate and that's gonna negatively impact our balance sheet. For solo-mining you pay once to participate: you just need the device that costs about 150 PLN (so one year worth of Lotto tickets) + the cost of electricity (power consumption of such devices is low). In terms of winning chances, even if you don't know a thing about cryptocurrencies, you might suspect that the chance of finding a right solution to the puzzles is way lower than picking correctly 6 numbers out of 49. But on the other hand for solo-mining you have a chance every 10 minutes, and for Lotto only once a week.

Our brains aren't naturally good at processing very small probabilities, so for example a 1 in 300 million chance doesn't feel that different from 1 in 30 million. That is probably why lottery operator firms don't go bankrupt. And that is also why we're going to calculate it precisely to have a clear comparison.

# First game - lotto

For Lotto it's rather straightforward to get the numbers. The game has been studied inside out and the math is basically refresher of combinatorics formulas from high school. To calculate chance of winning main prize in a single draw you need to use binomial coefficient ($\binom{n}{k} = \frac{n!}{k!(n-k)!}$). 

$\binom{49}{6} = 13\ 983\ 816$ - this tells you how many possible 6-numbers draws there are out of 49 numbers. Out of all these possible outcomes only one represents winning set of numbers, so the probability is 1 / 13 983 816.
That is 0.000007151%.

The general formula to calculate probability of drawing exactly $k$ numbers is: 
$$
P(k) = \frac{\binom{6}{k}\binom{43}{6-k}}{\binom{49}{6}}
$$


For expected value of single ticket we have to know the payouts. You win money when you match 3, 4, 5 or 6 numbers. For 3 numbers you get guaranteed 24 PLN. For 4 numbers you get on average 187.24 PLN (based on 100 last drawings). For 5 numbers you get on average 5807.11 PLN (also based on 100 last drawings). For 6 numbers, if you are the only person with the right ticket, you win 2000000 PLN or more if the last time the lottery took place no one won and it's a rollover. For our purpose let's assume it's 2M PLN. 

To calculate expected value we reuse formula provided above and the payouts information:

$EV = 24\*P(3) + 187.24\*P(4) + 5807.11\*P(5) + 2000000\*P(6) = 0.85 PLN$

So your total expected gross payout is 0.85 PLN, but you pay for the ticket 3 PLN, so that leaves you with -2.15 PLN expected net payout. So your expected loss per play is 2.15 PLN. In other words you could say that on average you get back 28.33% of what you spend (0.85 / 3).

Now let's back to our initial game assumption. I wanted to see what happens if I would play Lotto for 10 years, once a week.
That adds up to 520 tickets, so a total cost is 1560 PLN.
Our expected payouts is 442 PLN (0.85*520 - as events are independent we expect to get the same payout everytime).
So in total we expect to lose 1118 PLN.

Two interesting facts: 
- over 10 years we expect to match 3 numbers about 9 times: $520 * P(3) = 9.18$
- we have nearly 40% chance to match 4 numbers: $1 - (1 - P(4))^{520} = 0.396$ 


# Second game - solo mining

For solo mining we need to first understand better how this mystical "solving puzzles" work. To me it always sounded like some rocket-science task to perform that justify using so much computing power and driving up graphic card prices just in time when I needed to buy one back in 2019.

It turns out it's not complicated. The whole process is based on hashing. Hash functions take as input data of any size and return data with fixed size. They have a lot of use cases but are especially popular in cryptography, because of one property - they are irreversible, meaning you can't get back to input data having an output. One popular and important to our discussion hash function is function called SHA-256 (Secure Hash Algorithm; 256 because it always returns 256 bits as output; or 64 in hexadecimal). Below few examples of how this function works:

`SHA256('short\ input') = 9a200a1b21abbd44409feb953026612cefe3f31bd35ff1c4b7b45ede7ce4f76f`

`SHA256('short\ inputs') = 61ca78ec5b9849ad28dbf593dd9edcd780ea67c4cd936eb3f6721d7b80694fa8`

$sha256("and\ this\ is\ longer\ input") = e175aea5ffc33e3458472cc5dc42a8a906d1deecd09eea65f123f84f77f1d046$

Two desired properties shown here. First that for all cases the output length is the same. And second, that even small change in input leads to completely different output.

Now back to our bitcoin use case. As mentioned before, Miners try to add new Bitcoin transactions (gathered in a block) to entire history.
To do so, they take 





Lotto:
- https://chatgpt.com/c/69610bdd-aaa4-8329-b0e3-bc5617095b5b
- https://claude.ai/chat/1fcdff33-adcf-45ee-879a-7883d00f60bd



by-hand mining: https://www.righto.com/2014/09/mining-bitcoin-with-pencil-and-paper.html?m=1 
math of finding a bitcoin block: https://claude.ai/chat/e6c0c043-5a72-481e-9bae-72af1fa8031c 

jak liczyc prawdop:
chat: https://chatgpt.com/c/695d8ca8-ab50-8333-ae03-121b6df2eba6
claude: https://claude.ai/chat/56816c74-e885-4d12-a9e0-e406bf992c35 


bitcoin mining:
- https://claude.ai/chat/474277b1-2810-4ce9-84e0-9d4d9c9b0f75
- https://chatgpt.com/g/g-p-690271a377d881918d44ac0e78c12f46-post-crypto-lottery/c/69024da6-f054-8329-a4ed-cd92c0206e2f



Mining secures the network by making it prohibitively expensive to attack. An attacker would need to control over 50% of the network's computing power to manipulate the blockchain.



what encourages people towards lottery games/gambling?
20:04

This is a straightforward question about the psychology and factors behind why people engage in lottery games and gambling. This is a legitimate topic I can discuss factually and objectively. The person isn't asking me to help them gamble or encouraging harmful behavior - they're asking about the psychological and social factors that motivate this behavior.

I should provide a balanced, informative response covering the various psychological, social, and economic factors without being overly formatted with lists (per my instructions to avoid over-formatting). I'll write in natural prose.

People are drawn to lottery games and gambling through a fascinating mix of psychological, social, and economic factors.

The most powerful driver is probably the psychological appeal of hope and possibility. Even tiny odds can feel compelling when paired with life-changing potential rewards. Our brains aren't naturally good at processing very small probabilities, so a 1 in 300 million chance doesn't feel that different from 1 in 30 million. The relatively small cost of a lottery ticket makes it easy to justify as "buying a dream" for a few dollars.

There's also the phenomenon of "near misses" that keeps people engaged. Getting four out of six numbers, or watching the slot machine symbols almost line up, triggers similar brain responses to actual wins. This creates an illusion that you're "getting closer" even though each attempt is independent.

The intermittent reward structure is particularly powerful. Variable, unpredictable rewards are more compelling to the human brain than consistent ones. This is the same mechanism that makes social media scrolling or video games so engaging. You never know when the next win might come, which maintains interest and anticipation.

Social and cultural factors matter too. Lottery wins get significant media attention, making them memorable and creating availability bias - we overestimate the likelihood of things we can easily recall. In communities where economic mobility feels limited, gambling can seem like one of few viable paths to financial security. There's also a social aspect to gambling, whether it's office lottery pools or casino trips with friends.

For some, there's an element of magical thinking or personal superstition - lucky numbers, rituals, or a sense that "their time is due." The gambler's fallacy (believing past results affect future independent events) also plays a role.
