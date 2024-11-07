'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import ImageDisplay from '@/app/ui/imageDisplay'

export default function ItemCard({
  item,
  currentUser,
  userDisplayNames,
  onEdit,
  onDelete,
}) {
  const [selectedItem, setSelectedItem] = useState(null)

  const handleEdit = () => {
    onEdit(selectedItem._id)
  }

  const handleDelete = () => {
    onDelete(selectedItem._id)
  }

  return (
    <Card className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ImageDisplay
          image={item.logo}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <CardDescription className="flex-grow">
          {item.description}
        </CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag, tagIndex) => (
            <Badge key={tagIndex} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.image} alt={item.responsibleUser} />
            <AvatarFallback>
              {userDisplayNames[item.responsibleUser]
                ? userDisplayNames[item.responsibleUser]
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                : item.responsibleUser
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            {userDisplayNames[item.responsibleUser] || item.responsibleUser}
          </span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setSelectedItem(item)}>
              Detalhes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedItem.title}</DialogTitle>
                  <DialogDescription>{selectedItem.category}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <ImageDisplay
                    image={selectedItem.logo}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <p>{selectedItem.detailedDescription}</p>
                  </ScrollArea>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Informações de Contato</h4>
                    {/* Add contact information here */}
                    <p>{item.email}</p>
                  </div>
                  {selectedItem.responsibleUser === currentUser && (
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={handleEdit}>
                        Editar
                      </Button>
                      <Button variant="outline" onClick={handleDelete}>
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
