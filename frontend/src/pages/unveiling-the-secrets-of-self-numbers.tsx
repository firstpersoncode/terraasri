import { cases } from "@/libs/const";
import { ICase, ResSelfNumbers } from "@/libs/types";
import {
  Box,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
import axios from "axios";
import { ChevronLeft } from "@mui/icons-material";
import Link from "next/link";

export default function Case4() {
  const c: ICase = useMemo(() => cases[3], []);
  const [start, setStart] = useState("1");
  const [end, setEnd] = useState("4999");
  const [result, setResult] = useState<ResSelfNumbers["data"]>({
    sum: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchResult = useRef(
    throttle(async (start, end) => {
      if (!start) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<any, ResSelfNumbers>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/self-numbers?start=${start}&end=${end}`
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
    fetchResult.current(start, end);
  }, [start, end]);

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
          <Stack flexDirection="row" alignItems="center" gap={2} sx={{ mb: 4 }}>
            <IconButton
              LinkComponent={Link}
              href="/"
              sx={{ border: "1px solid #ddd" }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5">{c.subTitle}</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="start"
                label="Start"
                variant="outlined"
                type="number"
                value={start}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setStart(e.target.value);
                  setEnd(String(Number(e.target.value) + 4998));
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="end"
                label="End"
                variant="outlined"
                type="number"
                value={end}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEnd(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
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
            </Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
}
