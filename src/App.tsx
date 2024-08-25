//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Input, Grid, Button, Text } from "@chakra-ui/react";
import { useReadContract, useClient } from "wagmi";
import { createPublicClient, erc20Abi, http } from "viem";
import { config, publicClient } from "../wagmi.config";
import {
  TotalTransactionVolumePerBlock,
  BASEFEE_perBlock,
  GasUsed_vs_GasLimit_Ratio,
  GasMetrics_Chart,
} from "./charts";
import { getBlockNumber } from "viem/actions";

// Default ERC20 token on Ethereum mainnet
const defaultTokenAddress =
  import.meta.env.VITE_DEFAULT_TOKEN_ADDR ||
  "0x514910771AF9Ca656af840dff83E8264EcF986CA"; // LINK

const App: React.FC = () => {
  const [tokenAddress, setTokenAddress] =
    useState<`0x${string}`>(defaultTokenAddress);
  const [tokenName, setTokenName] = useState("ChainLink Token");
  const [tokenSymbol, setTokenSymbol] = useState("LINK");
  const [inputValue, setInputValue] = useState("");
  const [transactionVolumes, setTransactionVolumes] = useState<number[]>([]);
  const [baseFees, setBaseFees] = useState<bigint[]>([]);
  const [blockNumbers, setBlockNumbers] = useState<bigint[]>([]);
  const [gasUsed, setGasUsed] = useState<bigint[]>([]);
  const [gasLimit, setGasLimit] = useState<bigint[]>([]);
  const [gasUsedVsLimitRatio, setGasUsedVsLimitRatio] = useState<string[]>([]);

  const client = useClient(); //get Client from wagmi
  const _publicClient = publicClient; // Access viem publicClient from wagmi.config

  // Fetch token name
  // const { data: tokenName } = useReadContract({
  //   address: tokenAddress,
  //   abi: erc20Abi,
  //   functionName: "name",
  // });

  useEffect(() => {
    // Fetch the last 20 (10) blocks on initial load
    const fetchInitialData = async () => {
      const latestBlockNumber = await _publicClient.getBlockNumber();
      const blocksDataPromises = [];

      for (let i = 0; i < 20 /*10*/; i++) {
        blocksDataPromises.push(
          _publicClient.getBlock({
            blockNumber: latestBlockNumber - BigInt(i),
          })
        );
      }

      const blocksData = await Promise.all(blocksDataPromises);

      const transactionVolumes = blocksData.map(
        (block) => block.transactions.length
      );
      const baseFees = blocksData.map((block) => block.baseFeePerGas || 0n);
      const gasUsed = blocksData.map((block) => block.gasUsed);
      const gasLimit = blocksData.map((block) => block.gasLimit);
      const gasUsedVsLimitRatio = gasUsed.map((used, index) => {
        const limit = gasLimit[index];
        return ((used * 100n) / limit).toString();
      });
      const blockNumbers = blocksData.map((block) => block.number);

      setTransactionVolumes(transactionVolumes.reverse());
      setBaseFees(baseFees.reverse());
      // setGasLimit(gasLimit.reverse());
      setGasUsedVsLimitRatio(gasUsedVsLimitRatio.reverse());
      setBlockNumbers(blockNumbers.reverse());
    };

    fetchInitialData();

    // ***Fetch data @ interval
    const fetchInterval = 15000;
    const interval = setInterval(async () => {
      const latestBlockNumber = await _publicClient.getBlockNumber();
      const block = await _publicClient.getBlock({
        blockNumber: latestBlockNumber,
      });

      const transactionVolume = block.transactions.length;
      const baseFee = block.baseFeePerGas || 0n;
      const gasUsed = block.gasUsed;
      const gasLimit = block.gasLimit;
      const gasUsedVsLimitRatio = (block.gasUsed * 100n) / block.gasLimit;
      const gasRatioPercent = ((gasUsed * 100n) / gasLimit).toString();
      const blockNumber = block.number;

      //
      //
      console.log(`\n***New Block! --> ${latestBlockNumber}`);
      console.log({ transactionVolume });
      console.log({ baseFee });
      console.log(gasUsed);
      console.log("gasUsed: ", block.gasUsed);
      console.log({ gasLimit });
      console.log({ gasUsedVsLimitRatio });
      console.log(`${gasRatioPercent}%\n`);
      //
      //

      setTransactionVolumes((prev) => [...prev.slice(-19), transactionVolume]);
      setBaseFees((prev) => [...prev.slice(-19), baseFee]);
      setGasUsed((prev) => [...prev.slice(-19), gasUsed]);
      // setGasLimit((prev) => [...prev.slice(-19), gasLimit]);
      setGasUsedVsLimitRatio((prev) => [...prev.slice(-19), gasRatioPercent]);
      setBlockNumbers((prev) => [...prev.slice(-19), blockNumber]);
    }, fetchInterval);

    return () => clearInterval(interval);
  }, [_publicClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTokenAddressChange = () => {
    if (inputValue.startsWith("0x")) {
      const newAddress = inputValue as `0x${string}`;
      setTokenAddress(newAddress);

      // Fetch token name
      const {
        data: newTokenName,
        isError: isNameError,
        isLoading: isNameLoading,
      } = useReadContract({
        address: newAddress,
        abi: erc20Abi,
        functionName: "name",
      });

      // Fetch token symbol
      const {
        data: newTokenSymbol,
        isError: isSymbolError,
        isLoading: isSymbolLoading,
      } = useReadContract({
        address: newAddress,
        abi: erc20Abi,
        functionName: "symbol",
      });

      // Handle updating state with the fetched data
      if (!isNameError && !isNameLoading && newTokenName) {
        setTokenName(newTokenName);
      } else {
        setTokenName("Unknown Token");
      }

      if (!isSymbolError && !isSymbolLoading && newTokenSymbol) {
        setTokenSymbol(newTokenSymbol);
      } else {
        setTokenSymbol("Unknown Symbol");
      }
    } else {
      console.error(
        "Invalid address format. ERC20 token addresses must start with '0x'."
      );
      alert(
        "Invalid address format. ERC20 token addresses must start with '0x'."
      );
    }
  };

  return (
    <>
      <Box p={5}>
        <Text>
          Current Token: <b>{tokenName}</b>
        </Text>
        <Text>
          Symbol: <b>{tokenSymbol}</b>
        </Text>
        <Text fontSize="xl" mb={4}>
          <b>{tokenName} Data Dashboard</b>
        </Text>
        {/* <Input
          placeholder="Enter ERC20 Token Address"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button onClick={handleTokenAddressChange} mt={2}>
          Update Token Address
        </Button> */}
      </Box>
      <Box p={5}>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <TotalTransactionVolumePerBlock
            data={transactionVolumes}
            labels={blockNumbers.map((blockNum, index) =>
              index === 0
                ? blockNum.toString()
                : `...${blockNum.toString().slice(-3)}`
            )}
            yAxisLabel="Tx Volume"
          />
          <BASEFEE_perBlock
            data={baseFees.map((fee) => Number(fee))}
            labels={blockNumbers.map((blockNum, index) =>
              index === 0
                ? blockNum.toString()
                : `...${blockNum.toString().slice(-3)}`
            )}
            yAxisLabel="BASEFEE (Gwei)"
          />
          <GasUsed_vs_GasLimit_Ratio
            data={gasUsedVsLimitRatio.map((value) => parseFloat(value))}
            labels={blockNumbers.map((blockNum, index) =>
              index === 0
                ? blockNum.toString()
                : `...${blockNum.toString().slice(-3)}`
            )}
            yAxisLabel="gasUsed vs gasLimit Ratio (%)"
          />
          {/* <GasMetrics_Chart
            gasUsed={gasUsed}
            gasLimit={gasLimit}
            labels={blockNumbers.map((blockNum, index) =>
              index === 0
                ? blockNum.toString()
                : `...${blockNum.toString().slice(-3)}`
            )}
            yAxisLabel="'Gas Units'"
          /> */}
          <Text p={5} as="b">
            ** A note about the relationship between the BaseFee and Ratio
            charts. While the total transaction value goes up and down similarly
            to the Ratio of gas used and the gas limit, one can notice when
            comparing BaseFee and Ratio that their peaks and valleys are
            inverted. When gas goes down, basefee tends to go up, and vice
            versa.
          </Text>
        </Grid>
      </Box>
    </>
  );
};

export default App;
/** TODOs && IMPROVEMENTS:
 * - allow User to choose a different token to track
 *    - potentially just limit to the current top 5 tokens and those can be presented as radio btns
 */
