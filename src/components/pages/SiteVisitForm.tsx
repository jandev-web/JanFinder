'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import getQuoteDetails from '@/utils/getQuoteDetails'
import confirmSiteVerification from '@/utils/confirmSiteVerification'

interface RoomFull {
  roomType: string
  roomNumber: number
  sqft: {
    totalSqft: number
    wood: number
    tile: number
    carpet: number
    other: number
  }
}

interface SiteVistFormProps {
  quoteID: any,
  user: any
}

const SiteVistForm: React.FC<SiteVistFormProps> = ({ quoteID, user }) => {
  const router = useRouter()
  const userID = user.userId
  const [originalRooms, setOriginalRooms] = useState<RoomFull[]>([])
  const [editableRooms, setEditableRooms] = useState<RoomFull[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper: check if a field differs
  const fieldChanged = (orig: number, edit: number): boolean => orig !== edit

  // Determine if any field is still unconfirmed
  const anyPending = (): boolean => {
    for (let i = 0; i < originalRooms.length; i++) {
      const o = originalRooms[i]
      const e = editableRooms[i]
      if (o.roomNumber !== e.roomNumber) return true
      if (o.sqft.wood !== e.sqft.wood) return true
      if (o.sqft.tile !== e.sqft.tile) return true
      if (o.sqft.carpet !== e.sqft.carpet) return true
      if (o.sqft.other !== e.sqft.other) return true
    }
    return false
  }

  // All confirmed if nothing pending
  const allConfirmed = (): boolean => !anyPending()

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await getQuoteDetails(quoteID)
        const roomTypesArray: any[] = Array.isArray(data.quoteInfo.roomTypes)
          ? data.quoteInfo.roomTypes
          : []

        const rooms: RoomFull[] = roomTypesArray.map((r) => ({
          roomType: r.roomType,
          roomNumber: r.roomNumber,
          sqft: {
            totalSqft: r.sqft.totalSqft ?? 0,
            wood: r.sqft.wood ?? 0,
            tile: r.sqft.tile ?? 0,
            carpet: r.sqft.carpet ?? 0,
            other: r.sqft.other ?? 0,
          },
        }))

        setOriginalRooms(rooms)
        // Deep copy for editable state
        setEditableRooms(rooms.map((r) => JSON.parse(JSON.stringify(r))))
      } catch (e) {
        console.error(e)
        setError('Failed to load room details.')
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [quoteID])

  const handleRoomNumberChange = (idx: number, value: string) => {
    const num = Number(value)
    setEditableRooms((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, roomNumber: isNaN(num) ? 0 : num } : r
      )
    )
  }

  const confirmRoomNumber = (idx: number) => {
    setOriginalRooms((prev) =>
      prev.map((r, i) =>
        i === idx
          ? { ...r, roomNumber: editableRooms[i].roomNumber }
          : r
      )
    )
  }

  const handleRoomNumberBlur = (idx: number) => {
    const origVal = originalRooms[idx].roomNumber
    const editVal = editableRooms[idx].roomNumber
    if (origVal !== editVal) {
      // revert to original if not confirmed
      setEditableRooms((prev) =>
        prev.map((r, i) =>
          i === idx ? { ...r, roomNumber: origVal } : r
        )
      )
    }
  }

  const handleSqftChange = (
    idx: number,
    field: keyof RoomFull['sqft'],
    value: string
  ) => {
    const num = Number(value)
    setEditableRooms((prev) =>
      prev.map((r, i) =>
        i === idx
          ? {
              ...r,
              sqft: {
                ...r.sqft,
                [field]: isNaN(num) ? 0 : num,
              },
            }
          : r
      )
    )
  }

  const confirmSqftField = (
    idx: number,
    field: keyof RoomFull['sqft']
  ) => {
    setOriginalRooms((prev) =>
      prev.map((r, i) =>
        i === idx
          ? {
              ...r,
              sqft: {
                ...r.sqft,
                [field]: editableRooms[i].sqft[field],
              },
            }
          : r
      )
    )
  }

  const handleSqftBlur = (
    idx: number,
    field: keyof RoomFull['sqft']
  ) => {
    const origVal = originalRooms[idx].sqft[field]
    const editVal = editableRooms[idx].sqft[field]
    if (origVal !== editVal) {
      // revert to original if not confirmed
      setEditableRooms((prev) =>
        prev.map((r, i) =>
          i === idx
            ? {
                ...r,
                sqft: {
                  ...r.sqft,
                  [field]: origVal,
                },
              }
            : r
        )
      )
    }
  }

  const handleSubmit = async () => {
    const hasChanged = anyPending()
    const newRoomTypes = editableRooms.map((r) => ({
      roomType: r.roomType,
      roomNumber: r.roomNumber,
      sqft: { ...r.sqft },
    }))

    try {
      await confirmSiteVerification({
        quoteID,
        userID,
        hasChanged,
        newRoomTypes,
      })
      router.push(`/members/cbo/quote/accepted?id=${quoteID}`)
    } catch (error) {
      console.error('Error confirming site verification:', error)
    }
  }

  if (loading) return <p>Loading rooms…</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (originalRooms.length === 0) return <p>No rooms found.</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        Verify Room Measurements
      </h2>

      {editableRooms.map((room, idx) => {
        const orig = originalRooms[idx]

        return (
          <div
            key={idx}
            className="mb-8 border-b border-gray-200 pb-4"
          >
            {/* Room name and number */}
            <div className="flex items-center mb-4">
              <h3 className="flex-1 text-xl font-semibold">
                {room.roomType}
              </h3>
              <div className="flex items-center">
                <input
                  type="number"
                  value={room.roomNumber}
                  min={0}
                  onChange={(e) =>
                    handleRoomNumberChange(idx, e.target.value)
                  }
                  onBlur={() => handleRoomNumberBlur(idx)}
                  className="w-20 p-1 border rounded mr-2"
                />
                {fieldChanged(orig.roomNumber, room.roomNumber) && (
                  <button
                    type="button"
                    onMouseDown={() => confirmRoomNumber(idx)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>

            {/* Floor‐type breakdown */}
            {(['wood', 'tile', 'carpet', 'other'] as const).map(
              (floorType) => {
                const origVal = orig.sqft[floorType]
                const editVal = room.sqft[floorType]
                return (
                  <div
                    key={floorType}
                    className="flex items-center mb-2 ml-4"
                  >
                    <input
                      type="number"
                      value={editVal}
                      min={0}
                      onChange={(e) =>
                        handleSqftChange(
                          idx,
                          floorType,
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleSqftBlur(idx, floorType)
                      }
                      className="w-20 p-1 border rounded mr-2"
                    />
                    <label className="mr-2 capitalize">
                      {floorType} sqft
                    </label>
                    {fieldChanged(origVal, editVal) && (
                      <button
                        type="button"
                        onMouseDown={() =>
                          confirmSqftField(idx, floorType)
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                )
              }
            )}
          </div>
        )
      })}

      {allConfirmed() && (
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Confirm All
        </button>
      )}
    </div>
  )
}

export default SiteVistForm
