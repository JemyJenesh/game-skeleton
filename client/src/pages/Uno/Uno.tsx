import { Box, Stack, Typography } from "@mui/joy";
import React, { useEffect } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { clientSocket } from "../../App";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";
import { ArrowClockwiseIcon } from "../../icons";
import { UnoCard, getUno } from "../../utils/api";
import { useUnoGameStore } from "../../utils/uno";

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

function Card({
  card,
  isFlipped = false,
  discard,
}: {
  card: UnoCard;
  isFlipped?: boolean;
  discard?: (card: UnoCard) => void;
}) {
  const name = card.name;
  const handleClick = async () => {
    discard?.(card);
    // await sleep(5000);
    // nextPlayer();
  };

  return (
    <Flipped flipId={card._id}>
      <img
        src={`/static/uno/${isFlipped ? name : "card_back"}.png`}
        draggable={false}
        onClick={handleClick}
      />
    </Flipped>
  );
}

function PlayerCards({ cards }: { cards: UnoCard[] }) {
  // const playerIndex = useUnoGameStore((state) => state.playerIndex);
  // const discard = useUnoGameStore((state) => state.discard);

  return (
    <Box>
      <Stack direction="row">
        {cards?.map((card) => (
          <Box
            key={card._id}
            sx={{
              display: "inline-block",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-20px) scale(1.1)",
              },
              "&:hover ~ div": {
                transform: "translateX(20px)",
              },
              "&:not(:first-of-type)": {
                marginLeft: "-20px",
              },
            }}
          >
            <Card card={card} isFlipped />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function Uno() {
  const { id } = useParams();
  const { player } = usePlayer();

  const init = useUnoGameStore((state) => state.init);
  const players = useUnoGameStore((state) => state.players);
  const deck = useUnoGameStore((state) => state.deck);
  const pile = useUnoGameStore((state) => state.pile);
  const hands = useUnoGameStore((state) => state.hands);

  const serve = useUnoGameStore((state) => state.serve);
  const saveServe = useUnoGameStore((state) => state.saveServe);
  const navigate = useNavigate();

  const { isLoading, isError } = useQuery({
    queryKey: ["unos", id],
    queryFn: () => getUno(id!),
    onSuccess: (data) => {
      if (!data) {
        navigate("/");
      }

      init(data);

      if (data.state === "serving") {
        clientSocket.emit("order-serve-card", id);
      }
    },
  });

  useEffect(() => {
    if (id && players.length) {
      clientSocket.on(`serve-card_${id}`, () => {
        (async () => {
          for (let i = 0; i < players.length * 7; i++) {
            serve();
            await sleep(200);
          }
          saveServe();
        })();
      });
    }
  }, [id, players]);

  useEffect(() => {
    if (player?._id && players.length) {
      const isInGame = !!players.find((p) => p._id === player._id);

      if (!isInGame) {
        navigate("/");
      }
    }
  }, [player, players]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  const flipKey = hands
    ?.map((hand) => hand?.map((card) => card._id))
    .flat()
    .join("_");

  return (
    <PageTransition>
      <Flipper flipKey={flipKey}>
        <Stack
          sx={{
            height: "100vh",
            "& img": {
              height: 100,
              width: 72,
            },
          }}
          alignItems="center"
          justifyContent="space-between"
        >
          <PlayersSeat />
          <Stack
            direction="row"
            gap={10}
            sx={{
              justifyContent: "space-between",
              alignSelf: "self-start",
              width: "100%",
              px: 10,
            }}
          >
            <DrawPile />
            <DiscardPile />
            <div style={{ width: 72 }} />
          </Stack>

          <PlayerCards
            cards={hands[players.findIndex((p) => p._id === player?._id)]}
          />
        </Stack>
      </Flipper>
    </PageTransition>
  );
}

function DrawPile() {
  const deck = useUnoGameStore((state) => state.deck);

  return (
    <Box
      sx={{
        display: "flex",
        height: 100,
        width: 72,
        alignSelf: "self-start",
        transform:
          "perspective(350px) rotateZ(-20deg) rotateX(-10deg) rotateY(15deg)",
      }}
    >
      {deck?.map((card) => (
        <Flipped key={card._id} flipId={card._id}>
          <Box
            sx={{
              "&:not(:first-of-type)": {
                marginTop: "1px",
                marginLeft: "0.5px",
              },
            }}
          >
            <img
              style={{
                position: "absolute",
                height: 100,
                width: 72,
              }}
              src={`/static/uno/card_back.png`}
              draggable={false}
              // onClick={drawCard}
            />
          </Box>
        </Flipped>
      ))}
    </Box>
  );
}

function DiscardPile() {
  const pile = useUnoGameStore((state) => state.pile);
  const direction = useUnoGameStore((state) => state.direction);
  const deg = direction === -1 ? 0 : 180;

  return (
    <Box
      sx={{ display: "grid", placeItems: "center", gridTemplateAreas: "stack" }}
    >
      <Box sx={{ position: "absolute", transform: `rotateY(${deg}deg)` }}>
        <ArrowClockwiseIcon size={300} />
      </Box>
      {pile?.map((card) => (
        <Flipped key={card._id} flipId={card._id}>
          <Box
            sx={{
              gridArea: "stack",
              transform: `rotate(0deg)`,
            }}
          >
            <img src={`/static/uno/${card.name}.png`} draggable={false} />
          </Box>
        </Flipped>
      ))}
    </Box>
  );
}

function PlayersSeat() {
  const players = useUnoGameStore((state) => state.players);
  const { player: currentPlayer } = usePlayer();
  const playerIndex = players.findIndex((p) => p._id === currentPlayer?._id);
  const playersInOrder = [
    ...players.slice(playerIndex),
    ...players.slice(0, playerIndex),
  ];
  const hands = useUnoGameStore((state) => state.hands);

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        px: 3,
        py: 2,
        justifyContent: "space-around",
        alignItems: "center",
      }}
      gap={3}
    >
      {playersInOrder.map((player, i) => (
        <Stack
          key={player._id}
          direction={"row"}
          sx={{
            display: player._id === currentPlayer?._id ? "none" : "flex",
          }}
          gap={2}
        >
          <Stack>
            <img src={player.avatar} style={{ width: 50, height: 50 }} />
            <Typography>{player.name}</Typography>
          </Stack>

          <Box>
            {hands[(i + playerIndex) % players.length]?.map((card) => (
              <Box
                key={card._id}
                sx={{
                  display: "inline-block",
                  transition: "transform 0.2s",
                  "&:not(:first-of-type)": {
                    marginLeft: "-65px",
                  },
                }}
              >
                <Card card={card} />
              </Box>
            ))}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
