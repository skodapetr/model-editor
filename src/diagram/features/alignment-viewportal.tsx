import { ViewportPortal } from "@xyflow/react"
import {type AlignmentController } from "./alignment-controller-v2"


export const AlignmentComponent = (alignmentController: AlignmentController) => {

    return (<>
        {/* Horizontal line */}
        {
        alignmentController.horizontalAlignmentLine === null ? null : (<ViewportPortal>
          {/*With ChatGPTs help generate line in css*/}
           <div
           style={{
            position: "absolute",
            left: `${alignmentController.horizontalAlignmentLine.x}px`,
            top: `${alignmentController.horizontalAlignmentLine.y}px`,

            width: "20000px",           /* Set the length of the horizontal line */
            height: "2px",              /* Set the width of the line */
            backgroundColor: "black",   /* Color of the line */
          }}
           >
             {`This div is positioned at [${alignmentController.horizontalAlignmentLine.x}, ${alignmentController.horizontalAlignmentLine.y}] on the flow.`}
           </div>
         </ViewportPortal>)
         }

         {/* Vertical line */}
         {
         alignmentController.verticalAlignmentLine === null ? null : (<ViewportPortal>
           <div
             style={{

                position: "absolute",
                left: `${alignmentController.verticalAlignmentLine.x}px`,
                top: `${alignmentController.verticalAlignmentLine.y}px`,

                width: "2px",          /* Set the width of the vertical line */
                height: "20000px",       /* Set the length of the vertical line */
                backgroundColor: "black",  /* Color of the line */
             }}
           >
             {`This div is positioned at [${alignmentController.verticalAlignmentLine.x}, ${alignmentController.verticalAlignmentLine.y}] on the flow.`}
           </div>
         </ViewportPortal>)
         }
         </>
        );
}