import { NATIVE } from '@sushiswap/core-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import Container from 'app/components/Container'
import { NAV_CLASS } from 'app/components/Header/styles'
import useMenu from 'app/components/Header/useMenu'
import LanguageSwitch from 'app/components/LanguageSwitch'
import Web3Network from 'app/components/Web3Network'
import Web3Status from 'app/components/Web3Status'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useETHBalances } from 'app/state/wallet/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

import { NavigationItem } from './NavigationItem'

interface Desktop {
  fixed: boolean
  containerized: boolean
  className?: string
}

const Desktop: FC<Desktop> = ({ fixed, containerized, className = NAV_CLASS }) => {
  const menu = useMenu()
  const { account, chainId, library, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const isCbWallet =
    connector instanceof WalletLinkConnector ||
    (connector instanceof InjectedConnector && window.walletLinkExtension) ||
    window?.ethereum?.isCoinbaseWallet

  return (
    <>
      <header
        className={classNames(
          fixed ? 'fixed' : 'relative',
          'z-20 w-full hidden lg:block h-[64px] max-h-[64px] min-h-[64px]'
        )}
      >
        <nav className={classNames(className, 'h-[64px] max-h-[64px] min-h-[64px]')}>
          <Container maxWidth={containerized ? '7xl' : 'full'} className="mx-auto h-full">
            <div className={classNames('px-6 flex gap-4 items-center justify-between')}>
              <div className="flex gap-4">
                <div className="flex w-6 mr-4 items-center">
                  <Image src="https://app.sushi.com/images/logo.svg" alt="Sushi logo" width="24px" height="24px" />
                </div>
                {menu.map((node) => {
                  return <NavigationItem node={node} key={node.key} />
                })}
              </div>
              <div className="flex items-center justify-end gap-2">
                {library && (library.provider.isMetaMask || isCbWallet) && (
                  <div className="hidden sm:inline-block">
                    <Web3Network />
                  </div>
                )}

                <div className="flex items-center w-auto text-sm font-bold border-2 rounded shadow cursor-pointer pointer-events-auto select-none border-dark-800 hover:border-dark-700 bg-dark-900 whitespace-nowrap">
                  {account && chainId && userEthBalance && (
                    <Link href="/balances" passHref={true}>
                      <a className="hidden px-3 text-high-emphesis text-bold md:block">
                        {/*@ts-ignore*/}
                        {userEthBalance?.toSignificant(4)} {NATIVE[chainId || 1].symbol}
                      </a>
                    </Link>
                  )}
                  <Web3Status />
                </div>
                <div className="hidden lg:flex">
                  <LanguageSwitch />
                </div>
              </div>
            </div>
          </Container>
        </nav>
      </header>
      {fixed && <div className="h-[64px] max-h-[64px] min-h-[64px]" />}
    </>
  )
}

export default Desktop