import React from 'react'
import { Dialog } from './ui/dialog'
import { DialogContent } from '@radix-ui/react-dialog'

const CreatePost = ({open, setOpen}) => {
  return (
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=> setOpen(false)}>

        </DialogContent>
    </Dialog>
  )
}

export default CreatePost
