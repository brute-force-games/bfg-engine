import { PrettyJsonString } from "bfg-ui-components"
import { GameTable } from "~/models/game-table/game-table"
import { DbGameTableAction } from "~/models/game-table/game-table-action"


interface IHostedGameDetailsComponentProps {
  hostedGame: GameTable
  gameActions: DbGameTableAction[]
}

export const HostedGameDetailsComponent = ({
  hostedGame,
  gameActions,
}: IHostedGameDetailsComponentProps) => {

  // const gameTableId = hostedGame.id;

  // const [copySuccess, setCopySuccess] = useState(false);

  // const joinLink = createJoinGameUrl(gameTableId);
  // const fullJoinUrl = `${window.location.origin}${joinLink}`;

  // const copyJoinUrlToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(fullJoinUrl);
  //     setCopySuccess(true);
  //     setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //   }
  // };
  
  return (
    <div>
      {/* <h1>Host Game Details</h1> */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Game Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Game Title:</span>
                <span className="ml-2">{hostedGame?.gameTitle}</span>
              </div>
              <div>
                <span className="font-medium">Game ID:</span>
                <span className="ml-2 font-mono text-sm">{hostedGame?.id}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2">{hostedGame?.currentStatusDescription}</span>
              </div>
              <div>
                <span className="font-medium">Phase:</span>
                <span className="ml-2">{hostedGame?.tablePhase}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{ hostedGame ? new Date(hostedGame.createdAt).toLocaleString() : ''}</span>
              </div>
            </div>
          </div>

          <PrettyJsonString
            jsonString={JSON.stringify(hostedGame, null, 2)}
          />
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Game Actions</h2>
            <div className="space-y-3">
              {gameActions.map((action, index) => (
                <div key={index}>{action.actionType} [{action.source}] - {action.actionJson}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}