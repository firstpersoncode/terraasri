import { cases } from "@/libs/const";
import { ICase, ResCalculateDiagonalSum } from "@/libs/types";
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

export default function Case1() {
  const c: ICase = useMemo(() => cases[0], []);
  const [size, setSize] = useState("3");
  const [result, setResult] = useState<ResCalculateDiagonalSum["data"]>({
    matrix: [],
    sum: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchResult = useRef(
    throttle(async (size) => {
      if (!size) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<any, ResCalculateDiagonalSum>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/calculate-diagonal-sum/${size}`
        );
        setResult(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000)
  );

  useEffect(() => {
    setLoading(true);
    fetchResult.current(size);
  }, [size]);

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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                SelectProps={{ native: true }}
                label="Grid Size"
                value={size}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSize(e.target.value);
                }}
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map(
                  (option, k) => (
                    <option
                      key={k}
                      value={option}
                      disabled={String(option) === size}
                    >
                      {option}
                    </option>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={9}>
              {loading && <LinearProgress />}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#ddd",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm>
                    <Typography>MATRIX:</Typography>
                    {result.matrix.length > 0 &&
                      result.matrix.map((arr, i) => (
                        <Box key={i} sx={{ display: "flex" }}>
                          {arr.map((v, j) => (
                            <Box
                              key={j}
                              sx={{
                                width: 50,
                                height: 50,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: "1px solid #bbb",
                              }}
                            >
                              <Typography variant="h5">{v}</Typography>
                            </Box>
                          ))}
                        </Box>
                      ))}
                  </Grid>
                  <Grid item xs={12} sm>
                    <Typography>SUM:</Typography>
                    <Typography variant="h3">{result.sum}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
}
