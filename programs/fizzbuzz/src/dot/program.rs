#![allow(unused_imports)]
#![allow(unused_variables)]
#![allow(unused_mut)]
use crate::{id, seahorse_util::*};
use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use std::{cell::RefCell, rc::Rc};

#[account]
#[derive(Debug)]
pub struct FizzBuzz {
    pub fizz: bool,
    pub buzz: bool,
    pub n: u64,
}

impl<'info, 'entrypoint> FizzBuzz {
    pub fn load(
        account: &'entrypoint mut Box<Account<'info, Self>>,
        programs_map: &'entrypoint ProgramsMap<'info>,
    ) -> Mutable<LoadedFizzBuzz<'info, 'entrypoint>> {
        let fizz = account.fizz.clone();
        let buzz = account.buzz.clone();
        let n = account.n;

        Mutable::new(LoadedFizzBuzz {
            __account__: account,
            __programs__: programs_map,
            fizz,
            buzz,
            n,
        })
    }

    pub fn store(loaded: Mutable<LoadedFizzBuzz>) {
        let mut loaded = loaded.borrow_mut();
        let fizz = loaded.fizz.clone();

        loaded.__account__.fizz = fizz;

        let buzz = loaded.buzz.clone();

        loaded.__account__.buzz = buzz;

        let n = loaded.n;

        loaded.__account__.n = n;
    }
}

#[derive(Debug)]
pub struct LoadedFizzBuzz<'info, 'entrypoint> {
    pub __account__: &'entrypoint mut Box<Account<'info, FizzBuzz>>,
    pub __programs__: &'entrypoint ProgramsMap<'info>,
    pub fizz: bool,
    pub buzz: bool,
    pub n: u64,
}

pub fn do_fizzbuzz_handler<'info>(
    mut fizzbuzz: Mutable<LoadedFizzBuzz<'info, '_>>,
    mut n: u64,
) -> () {
    assign!(fizzbuzz.borrow_mut().fizz, (n % 3) == 0);

    assign!(fizzbuzz.borrow_mut().buzz, (n % 5) == 0);

    if (!fizzbuzz.borrow().fizz) && (!fizzbuzz.borrow().buzz) {
        assign!(fizzbuzz.borrow_mut().n, n);
    } else {
        assign!(fizzbuzz.borrow_mut().n, 0);
    }
}

pub fn init_handler<'info>(
    mut owner: SeahorseSigner<'info, '_>,
    mut fizzbuzz: Empty<Mutable<LoadedFizzBuzz<'info, '_>>>,
) -> () {
    fizzbuzz.account.clone();
}
