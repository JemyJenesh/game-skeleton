import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import React, { useEffect } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { clientSocket } from "../../App";
import { PageTransition } from "../../components";
import { usePlayer } from "../../hooks";
import { Uno, UnoCard, discardCard, drawCard, getUno } from "../../utils/api";
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

function useDiscardCard() {
  const mutation = useMutation({
    mutationFn: discardCard,
  });

  return mutation;
}

function PlayerCards({ cards }: { cards: UnoCard[] }) {
  const unoId = useUnoGameStore((state) => state._id);
  const winner = useUnoGameStore((state) => state.winner);
  const state = useUnoGameStore((state) => state.state);
  const pile = useUnoGameStore((state) => state.pile);
  const playingCard = pile[pile.length - 1];
  const players = useUnoGameStore((state) => state.players);
  const turn = useUnoGameStore((state) => state.turn);
  const { player } = usePlayer();

  const playerIndex = players.findIndex((p) => p._id === player?._id);
  const isMyTurn = turn === playerIndex;
  const mutation = useDiscardCard();
  const discard = (card: UnoCard) => {
    if (!!winner || state !== "playing") return;
    if (
      isMyTurn &&
      (playingCard.color === card.color || playingCard.value === card.value)
    ) {
      mutation.mutate({ id: unoId, card });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {mutation.isLoading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: -48,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      <Stack
        direction="row"
        sx={{
          opacity: isMyTurn ? 1 : 0.75,
          transition: "transform 0.2s",
          transform: !isMyTurn ? "scale(0.75) translateY(50%)" : undefined,
        }}
      >
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
            <Card card={card} isFlipped discard={discard} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function Uno() {
  const { id } = useParams();
  const { player } = usePlayer();
  const navigate = useNavigate();

  const state = useUnoGameStore((state) => state.state);
  const winner = useUnoGameStore((state) => state.winner);
  const players = useUnoGameStore((state) => state.players);
  const turn = useUnoGameStore((state) => state.turn);
  const hands = useUnoGameStore((state) => state.hands);
  const turnPlayer = players[turn];
  const turnPlayerName =
    turnPlayer?._id === player?._id ? "Your" : turnPlayer?.name;

  const init = useUnoGameStore((state) => state.init);
  const updateUno = useUnoGameStore((state) => state.updateUno);
  const serve = useUnoGameStore((state) => state.serve);
  const saveServe = useUnoGameStore((state) => state.saveServe);

  const { isLoading, isError } = useQuery({
    queryKey: ["unos", id],
    queryFn: () => getUno(id!),
    onSuccess: (data) => {
      if (!data) {
        navigate("/");
      }

      if (data.state === "serving") {
        init(data);
        clientSocket.emit("order-serve-card", id);
      } else {
        updateUno(data);
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
    if (id) {
      clientSocket.on(`uno-updated_${id}`, (data: Uno) => {
        updateUno(data);
      });
    }
  }, [id]);

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
          {state === "playing" && (
            <Typography level="body-lg">{turnPlayerName} turn</Typography>
          )}
          {!!winner && (
            <Typography level="h2">{winner.name} won the game!</Typography>
          )}
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

function useDrawCard() {
  const mutation = useMutation({
    mutationFn: drawCard,
  });

  return mutation;
}

function DrawPile() {
  const unoId = useUnoGameStore((state) => state._id);
  const winner = useUnoGameStore((state) => state.winner);
  const state = useUnoGameStore((state) => state.state);
  const deck = useUnoGameStore((state) => state.deck);
  const turn = useUnoGameStore((state) => state.turn);
  const hands = useUnoGameStore((state) => state.hands);
  const pile = useUnoGameStore((state) => state.pile);
  const topCard = pile[pile.length - 1];
  const players = useUnoGameStore((state) => state.players);
  const { player } = usePlayer();
  const isMyTurn = turn === players.findIndex((p) => p._id === player?._id);
  const hasMatch = hands[turn]?.some(
    (card) => card.value === topCard.value || card.color === topCard.color
  );
  const canDraw = isMyTurn && !hasMatch;
  const mutation = useDrawCard();
  const draw = () => {
    if (!!winner || state !== "playing") return;
    if (canDraw) {
      mutation.mutate(unoId);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        height: 100,
        width: 72,
        alignSelf: "self-start",
        transform:
          "perspective(350px) rotateZ(-20deg) rotateX(-10deg) rotateY(15deg)",
      }}
    >
      {mutation.isLoading && (
        <CircularProgress sx={{ position: "absolute", top: -48 }} />
      )}
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
              onClick={draw}
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

  return (
    <Box
      sx={{ display: "grid", placeItems: "center", gridTemplateAreas: "stack" }}
    >
      <Box
        sx={{
          position: "absolute",
          animationName: direction === 1 ? "spin" : "spin-reverse",
          animationDuration: "5s",
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
        }}
      >
        <DirectionIndicator direction={direction} />
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
  const winner = useUnoGameStore((state) => state.winner);
  const players = useUnoGameStore((state) => state.players);
  const turn = useUnoGameStore((state) => state.turn);
  const turnPlayer = players[turn];
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
            <img
              src={player.avatar}
              style={{
                width: 50,
                height: 50,
                border:
                  turnPlayer._id === player._id ? "3px solid #00C3E5" : "none",
                borderRadius: "50%",
              }}
            />
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
                    marginLeft: winner ? "-20px" : "-65px",
                  },
                }}
              >
                <Card card={card} isFlipped={winner ? true : false} />
              </Box>
            ))}
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

function DirectionIndicator({ direction }: { direction: 1 | -1 }) {
  const deg = direction === 1 ? 0 : 180;

  return (
    <svg
      height="256px"
      width="256px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 60 60"
      xmlSpace="preserve"
      fill="#26B99A"
      style={{
        transform: `rotateY(${deg}deg)`,
      }}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <path d="M52,31c-0.553,0-1-0.447-1-1c0-11.579-9.42-21-21-21S9,18.421,9,30c0,0.553-0.448,1-1,1 s-1-0.447-1-1C7,17.317,17.318,7,30,7s23,10.317,23,23C53,30.553,52.553,31,52,31z"></path>
          <path d="M52,31c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l7-7 c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-7,7C52.512,30.902,52.256,31,52,31z"></path>
          <path d="M52,31c-0.256,0-0.512-0.098-0.707-0.293l-7-7c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0l7,7c0.391,0.391,0.391,1.023,0,1.414C52.512,30.902,52.256,31,52,31z"></path>
          <path d="M30,53C17.318,53,7,42.683,7,30c0-0.553,0.448-1,1-1s1,0.447,1,1c0,11.579,9.42,21,21,21 s21-9.421,21-21c0-0.553,0.447-1,1-1s1,0.447,1,1C53,42.683,42.682,53,30,53z"></path>
          <path d="M1,38c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l7-7 c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-7,7C1.512,37.902,1.256,38,1,38z"></path>
          <path d="M15,38c-0.256,0-0.512-0.098-0.707-0.293l-7-7c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0l7,7c0.391,0.391,0.391,1.023,0,1.414C15.512,37.902,15.256,38,15,38z"></path>
        </g>
      </g>
    </svg>
  );
}
