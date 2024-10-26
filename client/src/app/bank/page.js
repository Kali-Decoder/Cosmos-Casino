"use client";
import GradientBorderButton from "@/components/GradientBorderButton";
import Navbar from "@/components/Navbar";
import HeaderText from "@/components/HeaderText";
import Container from "@/components/Container";
import GradientBgButton from "@/components/GradientBgButton";

const BalanceInfo = ({ balance, network, maxBorrowable }) => (
  <div className="magic-gradient p-0.5 rounded-md">
    <div className="bg-dark-pink font-sans flex gap-10 px-4 py-6 rounded-md">
      <div className="flex flex-col gap-3">
        <h5 className="text-xl font-sans">CURRENT BALANCE</h5>
        <span className="flex items-center mb-5 gap-1">
          <p className="font-medium text-3xl">{balance}</p>
          <p className="text-sm font-sans opacity-50 flex self-end">{network}</p>
        </span>
        <div>
          <div className="w-fit p-0.5 rounded-md magic-gradient">
            <input
              type="text"
              className="bg-dark-purple w-[250px] focus:outline-none p-1 rounded-md"
              placeholder={`Max borrowable: ${maxBorrowable}`}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="pt-32 bg-sharp-black text-white px-4 md:px-14">
        <HeaderText
          header="The Bank"
          description={"Hey champ! Hit the bank and get your assets to play a game."}
        />
        <div className="w-full justify-end font-display flex py-5">
          <div className="flex items-center px-3 flex-col border-r">
            <h5 className="text-sm">TOTAL APTC LIQUIDITY</h5>
            <span className="text-xl text-sharp-purple">203,746</span>
          </div>
          <div className="flex items-center px-3 flex-col">
            <h5 className="text-sm">1 APTC = $7.9 USDT</h5>
            <span className="text-xl text-sharp-purple">APY 2%</span>
          </div>
          <div className="w-1/12 flex items-end justify-center">
            <GradientBorderButton classes="w-full h-2/3">
              Lend
            </GradientBorderButton>
          </div>
        </div>
        <div className="w-full h-0.5 magic-gradient"></div>
        
        <Container heading="Borrow">
          <div className="flex flex-wrap w-full justify-around my-4 gap-4">
            <BalanceInfo balance="100 ATOM" network="Cosmos Testnet" maxBorrowable="100" />
            <button className="w-[120px] magic-gradient rounded-sm py-1 font-display">
              Bridge Your Assets (IBC)
            </button>
            <BalanceInfo balance="200 EVMOS" network="EVMOS Testnet" maxBorrowable="100" />
          </div>
        </Container>

        <Container heading="Deposit Collateral">
          <div className="magic-gradient rounded-md mt-5 p-0.5">
            <table className="w-full rounded-lg">
              <thead className="bg-dark-purple border-gradient w-full">
                <tr className=" border-gradient">
                  <th className="text-left py-4 p-10">ASSET</th>
                  <th className="text-left px-5">PRICE</th>
                  <th className="text-left">WALLET BALANCE</th>
                  <th className="text-left px-5">APY</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="bg-dark-pink">
                {["Evmos Testnet", "Cosmos Testnet"].map((asset, index) => (
                  <tr key={index} className="py-4">
                    <td className="flex py-4 gap-3 pl-10">{asset}</td>
                    <td className="px-5">$17.9</td>
                    <td>8.2 APTC</td>
                    <td className="px-5">1.94%</td>
                    <td className="flex items-center py-4 justify-center gap-5">
                      <GradientBorderButton>Withdraw</GradientBorderButton>
                      <GradientBgButton>Deposit</GradientBgButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>
    </>
  );
}
