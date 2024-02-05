import { cases, emojiArray } from "@/libs/const";
import { ICase, IEmoji, ResSecretMessage } from "@/libs/types";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import throttle from "lodash.throttle";
import axios from "axios";
import { Add } from "@mui/icons-material";

export default function Case5() {
  const c: ICase = useMemo(() => cases[4], []);
  const [word, setWord] = useState("");
  const [result, setResult] = useState<ResSecretMessage["data"]>({
    message: "",
    result: "",
  });
  const [loading, setLoading] = useState(false);
  const [addEmoji, setAddEmoji] = useState(false);
  const [emoji, setEmoji] = useState<IEmoji>({
    name: "",
    symbol: "",
    text: "",
  });

  const fetchEncrypt = useRef(
    throttle(async (word: string) => {
      if (!word) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post<any, ResSecretMessage>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/secret-message/encrypt`,
          { message: word }
        );
        setResult(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000)
  );

  const fetchDecrypt = useRef(
    throttle(async (word: string) => {
      if (!word) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post<any, ResSecretMessage>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/secret-message/decrypt`,
          { message: word }
        );
        setResult(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000)
  );

  const sendEmoji = useRef(
    throttle(async (emoji: IEmoji) => {
      if (!emoji.name || !emoji.symbol || !emoji.text) {
        setLoading(false);
        return;
      }

      try {
        await axios.post<any, ResSecretMessage>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/secret-message/token`,
          emoji
        );
        setAddEmoji(false);
        setEmoji({
          name: "",
          symbol: "",
          text: "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000)
  );

  //   useEffect(() => {
  //     setLoading(true);
  //     fetchResult.current(word);
  //   }, [word]);

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
            <Grid item xs={12} sm={5}>
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
                minRows={4}
                sx={{ mb: 2 }}
              />
              <Stack
                flexDirection="row"
                gap={2}
                sx={{ mb: 2, justifyContent: "flex-end" }}
              >
                <Button
                  disabled={loading}
                  color="error"
                  variant="contained"
                  onClick={() => fetchEncrypt.current(word)}
                >
                  Encode
                </Button>
                <Button
                  disabled={loading}
                  variant="contained"
                  onClick={() => fetchDecrypt.current(word)}
                >
                  Decode
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Add />}
                  onClick={() => setAddEmoji(true)}
                >
                  Add Emoji
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={7}>
              {loading && <LinearProgress />}
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#ddd",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>RESULT:</Typography>
                    <Typography variant="h5">{result.result}</Typography>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Typography>ROTATED WORDS:</Typography>
                    <Typography variant="h5">{result.rotated_word}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>IS PALINDROME:</Typography>
                    <Typography variant="h3">
                      {result.is_palindrome ? "Yes" : "No"}
                    </Typography>
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </main>

      <Dialog open={addEmoji} onClose={() => setAddEmoji(false)}>
        <DialogContent>
          <TextField
            fullWidth
            name="name"
            label="Identifier"
            variant="outlined"
            sx={{ mb: 2 }}
            value={emoji.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmoji((v) => {
                let currEmoji = { ...v };
                currEmoji.name = e.target.value;
                return currEmoji;
              });
            }}
            helperText="This emoji will be updated if the identifier already exists in database, so make sure to use unique identifier if you want to create new emoji"
          />
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            label="Emoji"
            value={emoji.symbol}
            sx={{ mb: 2 }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmoji((v) => {
                let currEmoji = { ...v };
                currEmoji.symbol = e.target.value;
                return currEmoji;
              });
            }}
          >
            {emojiArray.map((option, k) => (
              <option key={k} value={option}>
                {option}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            name="text"
            label="Text"
            variant="outlined"
            sx={{ mb: 2 }}
            multiline
            minRows={2}
            value={emoji.text}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmoji((v) => {
                let currEmoji = { ...v };
                currEmoji.text = e.target.value;
                return currEmoji;
              });
            }}
          />
          <Button
            disabled={loading}
            variant="contained"
            onClick={() => sendEmoji.current(emoji)}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
