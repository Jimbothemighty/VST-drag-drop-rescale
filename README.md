# Application Template Readme

# VST Interview task
- https://file.notion.so/f/s/9727accf-0093-4271-98e9-2aac75ae4e20/VST_TECHNICAL_TAKE_HOME_TASK_FE.md?id=3ebcd566-f7d7-4235-ac96-07e83f94f4b5&table=block&spaceId=e5dbac9a-1f47-40f4-93a3-6354faa40325&expirationTimestamp=1698199200000&signature=GBsI-bWsWoegApB_DaSOH2N19GqQY_pQf3FdnB6ZmhU&downloadName=VST_TECHNICAL_TAKE_HOME_TASK_FE.md

## Overview
- Drag on click following mouse
- Resize on pinch-zoom
- Boundary limits (20px from edge)
- Screen resize enforces boundaries (although will overflow if window is smaller than element size)
- Min / Max scale to /4 and *4
- Smooth glide to centre on button press

# Running the project
- Download code
- Open in VSCode / Terminal
- `npm install`
- `npm run dev`

# Notes
- I ran this in host mode so it exposed over 192.168 so I could test via my phone.
- I made the class write the dimensions into the drag square to prove that it did not exceed or underflow the scale limits.

# Issues
- I think on first click then the drag is not initiating for some reason. But its a barely noticable issue.
- Interview guidance asked for resize ideally with 1 finger. I couldn't understand how to achieve that in the time provided given that it would be indistinguishable from a normal drag event.
- In order to understand the boundary I refer directly to the body.clientWidth/clientHeight, which is also the container element provided to PointerTracker. This is a private propety in PointerTracker. It would be better to modify the library to make it protected so that it can be referenced in my extension class. Without this then potentially I could pass in a different container than the body and then I have to modify my code in other non-obvious places to make it work.