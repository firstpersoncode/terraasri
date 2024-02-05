import { cases } from "@/libs/const";
import { ICase, ResSelfNumbers } from "@/libs/types";
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
import axios from "axios";

export default function Case4() {
  const c: ICase = useMemo(() => cases[3], []);
  const [number, setNumber] = useState("75");
  const [result, setResult] = useState<ResSelfNumbers["data"]>({
    sum: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchResult = useRef(
    throttle(async (number) => {
      if (!number) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get<any, ResSelfNumbers>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/self-numbers/${number}`
        );
        setResult(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 3000)
  );

  useEffect(() => {
    setLoading(true);
    fetchResult.current(number);
  }, [number]);

  return (
    <>
      <Head>
        <title>{`${c.title}: ${c.subTitle}`}</title>
        <meta name="description" content={c.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container sx={{ my: 2 }}>
          <TextField
            fullWidth
            name="number"
            label="Number"
            variant="outlined"
            type="number"
            value={number}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNumber(e.target.value);
            }}
            sx={{ mb: 2 }}
          />
          {loading && <LinearProgress />}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#ddd",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm>
                <Typography>SUM:</Typography>
                <Typography variant="h3">{result.sum}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </main>
    </>
  );
}
