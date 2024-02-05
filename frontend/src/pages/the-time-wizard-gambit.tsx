import { cases } from "@/libs/const";
import { ICase, ResFindCommonSlot } from "@/libs/types";
import {
  Box,
  Button,
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
import { Add, Close } from "@mui/icons-material";

export default function Case2() {
  const c: ICase = useMemo(() => cases[1], []);
  const [slots, setSlots] = useState<string[][][]>([
    [
      ["9", "12"],
      ["14", "16"],
    ],
    [
      ["10", "12"],
      ["15", "17"],
    ],
    [
      ["11", "13"],
      ["16", "18"],
    ],
  ]);
  const [result, setResult] = useState<ResFindCommonSlot["data"]>({
    common: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchResult = useRef(
    throttle(async (slots: string[][][]) => {
      if (!slots.length) {
        setLoading(false);
        return;
      }
      for (let slot of slots) {
        if (!slot.length) {
          setLoading(false);
          return;
        }

        for (let time of slot) {
          if (!time.length) {
            setLoading(false);
            return;
          }
        }
      }

      try {
        const response = await axios.post<any, ResFindCommonSlot>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/go/find-common-slot`,
          {
            slots: slots.map((slot) =>
              slot.map((time) => time.map((v) => Number(v)))
            ),
          }
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
    fetchResult.current(slots);
  }, [slots]);

  const add = () => {
    setSlots((v) => {
      let currSlots = [...v];
      return [...currSlots, []];
    });
  };

  const addSlot = (i: number) => {
    setSlots((v) => {
      let currSlots = [...v];
      currSlots[i] = [...currSlots[i], []];
      return currSlots;
    });
  };

  const updateSlot = (i: number, j: number, pos: number, value: string) => {
    setSlots((v) => {
      let currSlots = [...v];
      currSlots[i][j][pos] = value;
      if (pos === 0) {
        currSlots[i][j][1] = value !== "24" ? String(Number(value) + 1) : "24";
      }
      return currSlots;
    });
  };

  const removeSlot = (i: number, j: number) => {
    setSlots((v) => {
      let currSlots = [...v];
      currSlots[i] = [
        ...currSlots[i].slice(0, j),
        ...currSlots[i].slice(j + 1),
      ];
      return currSlots;
    });
  };

  const remove = (i: number) => {
    setSlots((v) => {
      let currSlots = [...v];
      return [...currSlots.slice(0, i), ...currSlots.slice(i + 1)];
    });
  };

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
            <Grid item xs={12} sm={4}>
              {slots.length > 0 &&
                slots.map((slot, i) => (
                  <Box key={i} sx={{ p: 2, backgroundColor: "#ddd", mb: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Diplomat {i + 1}
                    </Typography>
                    {slot.length > 0 &&
                      slot.map((time, j) => (
                        <Stack
                          key={j}
                          direction="row"
                          gap={2}
                          sx={{ mb: 2, alignItems: "center" }}
                        >
                          <TextField
                            select
                            SelectProps={{ native: true }}
                            label="Start"
                            value={time[0]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              updateSlot(i, j, 0, e.target.value);
                            }}
                          >
                            {Array.from({ length: 24 }, (_, i) => i + 1).map(
                              (option, k) => (
                                <option
                                  key={k}
                                  value={option}
                                  disabled={String(option) === time[0]}
                                >
                                  {option}
                                </option>
                              )
                            )}
                          </TextField>
                          <TextField
                            select
                            SelectProps={{ native: true }}
                            label="End"
                            value={time[1]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              updateSlot(i, j, 1, e.target.value);
                            }}
                          >
                            {Array.from({ length: 24 }, (_, i) => i + 1).map(
                              (option, k) => (
                                <option
                                  key={k}
                                  value={option}
                                  disabled={
                                    String(option) === time[1] ||
                                    option <= Number(time[0])
                                  }
                                >
                                  {option}
                                </option>
                              )
                            )}
                          </TextField>
                          <IconButton onClick={() => removeSlot(i, j)}>
                            <Close />
                          </IconButton>
                        </Stack>
                      ))}
                    <Stack direction="row" gap={2}>
                      <Button
                        variant="contained"
                        onClick={() => addSlot(i)}
                        startIcon={<Add />}
                        size="small"
                      >
                        Add Time Slot
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => remove(i)}
                        startIcon={<Close />}
                        size="small"
                      >
                        Remove Diplomat
                      </Button>
                    </Stack>
                  </Box>
                ))}
              <Button
                variant="contained"
                fullWidth
                onClick={add}
                startIcon={<Add />}
              >
                Add Diplomat
              </Button>
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
                    <Typography>COMMON:</Typography>
                    {result.common && result.common.length > 0 && (
                      <Box sx={{ display: "flex", gap: 2 }}>
                        {result.common.map((time, i) => (
                          <Typography variant="h3" key={i}>
                            {time}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    {result.message && (
                      <Typography>{result.message}</Typography>
                    )}
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
