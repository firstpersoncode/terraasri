import { cases } from "@/libs/const";
import { ICase, ResIsCircularPalindrome } from "@/libs/types";
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
import Link from "next/link";
import { ChevronLeft } from "@mui/icons-material";

export default function Case3() {
  const c: ICase = useMemo(() => cases[2], []);
  const [word, setWord] = useState("racecar");
  const [result, setResult] = useState<ResIsCircularPalindrome["data"]>({
    word: "",
    rotated_word: "",
    is_palindrome: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchResult = useRef(
    throttle(async (word: string) => {
      if (!word) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<any, ResIsCircularPalindrome>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/is-circular-palindrome/${word}`
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
    fetchResult.current(word);
  }, [word]);

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
                name="word"
                label="Words"
                variant="outlined"
                value={word}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setWord(e.target.value);
                }}
                multiline
                minRows={3}
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
                    <Typography>WORDS:</Typography>
                    <Typography variant="h5">{result.word}</Typography>
                  </Grid>
                  <Grid item xs={12} sm>
                    <Typography>ROTATED WORDS:</Typography>
                    <Typography variant="h5">{result.rotated_word}</Typography>
                  </Grid>
                  <Grid item xs={12} sm>
                    <Typography>IS PALINDROME:</Typography>
                    <Typography variant="h3">
                      {result.is_palindrome ? "Yes" : "No"}
                    </Typography>
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
