-- Sample program from Haskell's home page

primes = primes' [2..] 
  {- filterPrime is appended with an apostrophe
     and they should be treated as one single identifier -}
  where primes' (p:xs) = 
          p : primes' [x | x <- xs, x `mod` p /= 0]
