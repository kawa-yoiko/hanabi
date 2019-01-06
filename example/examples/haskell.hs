-- Sample program from Haskell's home page

primes = filterPrime' [2..] 
  {- filterPrime is appended with an apostrophe
     and they should be treated as one single identifier -}
  where filterPrime' (p:xs) = 
          p : filterPrime' [x | x <- xs, x `mod` p /= 0]
