import { GameLobby, LobbyOptions } from "../../../models/p2p-lobby"
import { PlayerProfileId } from "../../../models/types/bfg-branded-uuids"
import { PublicPlayerProfile } from "../../../models/internal/player-profile/public-player-profile"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { BfgShareableLinkComponent } from "../bfg-shareable-link-component"
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Clear,
  PersonRemove,
  Gamepad,
  Settings,
  Groups
} from "../../bfg-ui" 
import { useSiteHosting } from "../../../hooks/site-hosting"
import { useGameRegistry } from "../../../hooks/games-registry/games-registry-hook"
import { PlayerProfileChip } from "../player-profile-chip"
import { validateLobby } from "../../../ops/game-lobby-ops/lobby-utils"
import { LobbyHostOptionsDialog } from "../dialogs/lobby-host-options-dialog"
import { doStartGame } from "./start-game-utils"


interface ILobbyHostStateComponentProps {
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  lobbyState: GameLobby
  updateLobbyState: (lobbyState: GameLobby) => void
  // setLobbyPlayerPool: (playerPool: PlayerProfileId[]) => void

  lobbyOptions: LobbyOptions
  setLobbyOptions: (lobbyOptions: LobbyOptions) => void
  autoStart?: boolean
}

export const LobbyHostStateComponent = ({
  playerProfiles,
  lobbyState,
  updateLobbyState,
  // setLobbyPlayerPool,
  lobbyOptions,
  setLobbyOptions,
  autoStart = false,
}: ILobbyHostStateComponentProps) => {

  const siteHosting = useSiteHosting();
  const gameRegistry = useGameRegistry();
  const navigate = useNavigate();

  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isLobbyOptionsDialogOpen, setIsLobbyOptionsDialogOpen] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);


  const startGame = useCallback(async () => {
    if (!lobbyState.gameTitle) {
      alert('Please select a game title first');
      return;
    }

    // Prevent multiple calls
    if (isStartingGame) {
      console.log("Game is already starting, ignoring duplicate request");
      return;
    }

    // const metadata = gameRegistry.getGameMetadata(lobbyState.gameTitle);
    // const gameProcessor = metadata.gameProcessor;

    // const gameSchema = metadata.schemas;

    

    // const initialGameSpecificAction = gameProcessor.createHostStartsGameAction(newGameTable, lobbyState);
    // const initialGameSpecificState = gameProcessor.createHostOpensGameState(newGameTable, initialGameSpecificAction);

    setIsStartingGame(true);

    try {
      await doStartGame(lobbyState, gameRegistry, siteHosting, updateLobbyState);
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsStartingGame(false);
    }

    // try {
    //   // const newGameTableId = BfgGameTableIdToolbox.createRandomId() as BfgGameTableId;
    //   const newGameRoomGuid = generateUuidKey();
    //   const newGameRoomId = BfgGameRoomIdToolbox.createIdForKey(newGameRoomGuid);
    //   const newGameTableId = BfgGameTableIdToolbox.createIdForKey(newGameRoomGuid);
    //   const newGameInstanceId = BfgGameInstanceIdToolbox.createIdForKey(newGameRoomGuid);

    //   console.log("starting game", lobbyState);
    //   const gameTable = await asHostStartNewGame(gameRegistry, lobbyState, newGameRoomId, newGameTableId);
    //   console.log("NEW GAME TABLE", gameTable);

    //   const playGameLink = siteHosting.createPlayerGameUrl(newGameInstanceId);
    //   updateLobbyState({ ...lobbyState, playGameLink, gameInstanceId: newGameInstanceId });
    // } catch (error) {
    //   console.error("Error starting game:", error);
    // } finally {
    //   setIsStartingGame(false);
    // }
  }, [lobbyState, isStartingGame, gameRegistry, siteHosting, updateLobbyState]);

  const startNewLobby = () => {
    navigate({
      to: '/new-lobby',
      search: {
        gameTitle: lobbyState.gameTitle || undefined,
      },
    });
  }

  const playerPoolChips = lobbyState.playerPool.map(playerProfile => {
    return (
      <PlayerProfileChip
        key={playerProfile.id}
        playerProfileId={playerProfile.id}
        playerProfiles={playerProfiles}
        myPlayerProfile={lobbyState.gameHostPlayerProfile}
      />
    );
  }) ?? [];

  const isGameStarted = lobbyState.playGameLink !== undefined;

  // Auto-start game when autoStart is true and lobby is valid
  useEffect(() => {
    if (autoStart && !hasAutoStarted && lobbyState.isLobbyValid && lobbyState.gameTitle && !isGameStarted && !isStartingGame) {
      setHasAutoStarted(true);
      startGame();
    }
  }, [autoStart, hasAutoStarted, lobbyState.isLobbyValid, lobbyState.gameTitle, isGameStarted, isStartingGame, startGame]);

  const baseUrl = siteHosting.getBaseUrl();
  
  // const hostingLink = lobbyState.gameTableId ? 
  //   `${baseUrl}/hosted-games/${lobbyState.gameTableId}` :
  //   '';
  const hostingLink = lobbyState.gameInstanceId ? 
    siteHosting.createHostedGameUrl(lobbyState.gameInstanceId) :
    '';
      
  const observerLink = lobbyState.gameInstanceId ?
    siteHosting.createObserverGameUrl(lobbyState.gameInstanceId) :
    '';

  const lobbyValidLabel = lobbyState.isLobbyValid ? 
    '[Valid]' :
    '[Invalid]';

  const playerCountLabel = lobbyState.gameTitle === undefined ? 
    '' :
    `[${lobbyState.minNumPlayers} - ${lobbyState.maxNumPlayers} players]`;

  const joinLobbyLink = `${baseUrl}/join-lobby/${lobbyState.id}?autoJoin=true`;

  if (isGameStarted) {
    return (
      <>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2" gutterBottom>
            <i>{lobbyState.gameTitle}</i> will start once you open the Hosting Link! Players should join using the player link.
          </Typography>

          {(lobbyState.playGameLink || hostingLink) && (
            <Box>
              <Stack spacing={1}>
                {hostingLink && (
                  <BfgShareableLinkComponent
                    variant="standard"
                    linkLabel="Hosting Link"
                    linkUrl={hostingLink}
                  />
                )}
                {lobbyState.playGameLink && (
                  <BfgShareableLinkComponent
                    variant="standard"
                    linkLabel="Player Game Link"
                    linkUrl={lobbyState.playGameLink}
                  />
                )}
                {observerLink && (
                  <BfgShareableLinkComponent
                    variant="standard"
                    linkLabel="Observer Game Link"
                    linkUrl={observerLink}
                    showQrCode={true}
                  />
                )}

              </Stack>
              <Box>
                <Stack direction="row" spacing={1} style={{ alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Player Pool
                  </Typography>
                  <Typography variant="body2" style={{ color: '#666' }}>
                    [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {playerPoolChips.length > 0 ? playerPoolChips : (
                    <Typography variant="body2" style={{ color: '#666', fontStyle: 'italic' }}>
                      No players in pool
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          <Box>
            <Button
              variant="outlined"
              onClick={startNewLobby}
              color="primary"
              startIcon={<Groups />}
            >
              Start New {lobbyState.gameTitle} Lobby
            </Button>
          </Box>
        </Stack>
      </>
    )
  }

  const invalidLobbyReasons = lobbyState.isLobbyValid ? 
    [] :
    validateLobby(gameRegistry, lobbyState);


  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" style={{ alignItems: 'center' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {lobbyState.lobbyName}
            </Typography>
            <Chip 
              label={lobbyValidLabel} 
              color={lobbyState.isLobbyValid ? "success" : "error"}
              size="small"
            />
            <Chip 
              label={`${lobbyState.playerPool.length} players`}
              variant="outlined"
              size="small"
            />
          </Stack>
            <Typography variant="body2" gutterBottom style={{ color: '#666', fontStyle: 'italic' }}>
              hosted by {lobbyState.gameHostPlayerProfile.handle}
            </Typography>
          {!lobbyState.isLobbyValid && (
            <>
              <Alert severity="warning" style={{ marginTop: '8px' }}>
                Lobby configuration is invalid.
              </Alert>
              <ul>
                {invalidLobbyReasons.map(reason => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </>
          )}
        </Box>

        {/* Action Buttons */}
        <Box>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              onClick={() => startGame()}
              disabled={isGameStarted || isStartingGame || !lobbyState.isLobbyValid}
              color="primary"
              size="large"
            >
              {isStartingGame ? '⟳ ' : ''}{isStartingGame ? `Starting ${lobbyState.gameTitle}...` : `▶ Start ${lobbyState.gameTitle || 'Game'}`}
            </Button>
          </Stack>
        </Box>

        <BfgShareableLinkComponent
          variant="standard"
          linkLabel="Join Lobby Link"
          linkUrl={joinLobbyLink}
          showQrCode={true}
        />

        {/* Player Pool */}
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" style={{ alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="h6" component="h2">
              Player Pool
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                updateLobbyState({ ...lobbyState, playerPool: [] });
              }}
              disabled={isGameStarted || lobbyState.playerPool.length === 0}
              color="warning"
              style={{ minWidth: 'auto', padding: '4px 8px' }}
            >
              <PersonRemove /> Clear Seats
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} style={{ alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="body2" style={{ color: '#666' }}>
              [{lobbyState.playerPool.length}/{lobbyState.maxNumPlayers}]
            </Typography>
          </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {playerPoolChips.length > 0 ? playerPoolChips : (
                  <Typography variant="body2" style={{ color: '#666', fontStyle: 'italic' }}>
                    No players in pool
                  </Typography>
                )}
              </Stack>
        </Box>

        {/* Game Title */}
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" style={{ alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="h6" component="h2">
              Game Selection
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => updateLobbyState({ 
                ...lobbyState, 
                gameTitle: undefined,
                isLobbyValid: false,
              })}
              disabled={isGameStarted || !lobbyState.gameTitle}
              color="warning"
              style={{ minWidth: 'auto', padding: '4px 8px' }}
            >
              <Clear /> Clear Game
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsLobbyOptionsDialogOpen(true)}
              disabled={isGameStarted}
              style={{ minWidth: 'auto', padding: '4px 8px' }}
            >
              <Settings /> Configure
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" style={{ alignItems: 'center' }}>
            <Gamepad style={{ color: '#1976d2' }} />
            <Typography variant="body1">
              {lobbyState.gameTitle || "No game selected"}
            </Typography>
            {playerCountLabel && (
            <Chip 
              label={playerCountLabel} 
              variant="outlined"
              size="small"
            />
            )}
          </Stack>
        </Box>

        {/* Status Messages */}
        {isGameStarted && (
          <Alert severity="success">
            Game has been started! Players can now join using the game link.
          </Alert>
        )}
      </Stack>
      <LobbyHostOptionsDialog
        open={isLobbyOptionsDialogOpen}
        onClose={() => setIsLobbyOptionsDialogOpen(false)}
        onSave={setLobbyOptions}
        initialLobbyOptions={lobbyOptions}
        selectedGameChoice={lobbyState.gameTitle ?? null}
      />
    </>
  )
}
